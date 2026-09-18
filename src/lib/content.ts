import facts from "@/data/cluster_facts.json";

export const REPO_URL = "https://github.com/nicolas2601/nicolas-pruebas-gpu";
export const RELEASE_URL = `${REPO_URL}/releases/tag/v0.1.0-ddp10`;
export const WEIGHTS_URL = `${REPO_URL}/releases/download/v0.1.0-ddp10/dinov2_vits14_simsiam_imagenette_backbone.pt`;
export const EXPORT_URL = `${REPO_URL}/releases/download/v0.1.0-ddp10/nicolas_pruebas_export.tar.gz`;

export type Spec = { label: string; value: string; detail?: string; accent?: "amber" | "sky" };

const gpuLines = facts.gpus.split("\n");

export const CLUSTER_SPECS: Spec[] = [
  { label: "GPUs", value: `${gpuLines.length}x RTX PRO 4000`, detail: "Blackwell, 24 GB GDDR7 cada una", accent: "amber" },
  { label: "VRAM total", value: "48 GB", detail: "24 467 MiB por GPU, sin NVLink (PCIe)" },
  { label: "CPU", value: facts.cpu.replace("Intel(R) Xeon(R) ", "Xeon "), detail: `${facts.cores} hilos, 24 núcleos` },
  { label: "RAM", value: facts.ram.replace("Gi", " GB"), detail: "Sin límite de cgroup en el pod" },
  { label: "Driver / CUDA", value: `${gpuLines[0].split(", ")[2]} / ${facts.cuda}`, detail: `torch ${facts.torch}`, accent: "sky" },
  { label: "Python", value: facts.python, detail: "conda env propio del proyecto" },
  { label: "/dev/shm", value: facts.shm.replace("M", " MB"), detail: "El límite que rompió los DataLoader workers", accent: "amber" },
  { label: "Home NFS", value: "40 TB", detail: "QNAP compartido, persistente en ~/work" },
  { label: "Sistema", value: facts.os.replace(" LTS", ""), detail: `kernel ${facts.kernel}, pod Kubernetes` },
];

export type TimelineItem = {
  time: string;
  title: string;
  status: "ok" | "fail" | "pending";
  symptom: string;
  cause: string;
  fix: string;
};

export const TIMELINE: TimelineItem[] = [
  {
    time: "20:07",
    title: "STL-10 no bajaba",
    status: "fail",
    symptom: "El dataset planeado (2,6 GB) descargaba a 0,9 MB/s: 45 minutos solo para empezar.",
    cause: "El único mirror es un servidor de Stanford sin CDN.",
    fix: "Cambiamos a Imagenette 160px (99 MB desde S3, segundos). STL-10 quedó como opción con --dataset stl10.",
  },
  {
    time: "20:16",
    title: "Los workers del DataLoader morían",
    status: "fail",
    symptom: "RuntimeError: unable to allocate shared memory (shm) al arrancar el primer batch.",
    cause: "El pod de Kubernetes monta /dev/shm de 64 MB. Los workers pasan los batches por ahí y un batch de 128 imágenes x 2 vistas no cabe.",
    fix: "safe_workers() mide /dev/shm y fuerza workers=0 si hay menos de 256 MB. Consecuencia: la CPU decodifica imágenes en el proceso principal y limita el throughput.",
  },
  {
    time: "20:19",
    title: "Smoke en 1 GPU",
    status: "ok",
    symptom: "30 pasos sobre 4 096 imágenes: kNN 0,976 → 0,981, loss -0,23, sin colapso, 2,2 GB de VRAM.",
    cause: "Valida todo el cableado: datos, pesos DINOv2 vía torch.hub, bf16, pérdida, probe kNN y TensorBoard.",
    fix: "Luz verde para DDP.",
  },
  {
    time: "20:20",
    title: "DDP se negaba a arrancar",
    status: "fail",
    symptom: "Expected to have finished reduction in the prior iteration... parameters that were not used in producing loss.",
    cause: "DINOv2 trae un parámetro mask_token que no participa en el forward normal. DDP exige que todo parámetro con gradiente reciba uno.",
    fix: "Congelar mask_token (requires_grad=False). Más barato que find_unused_parameters=True, que cuesta rendimiento en cada paso. Aplica igual al v6 del proyecto de grado.",
  },
  {
    time: "20:22",
    title: "rm -rf falló en NFS",
    status: "fail",
    symptom: "rm: cannot remove 'runs/2gpu/tb': Directory not empty.",
    cause: "TensorBoard tenía abierto el event file; NFS lo renombra a .nfsXXXX en vez de borrarlo.",
    fix: "Matar TensorBoard antes de borrar, o usar otro nombre de run.",
  },
  {
    time: "20:29",
    title: "DDP en 2 GPUs, 10 épocas",
    status: "ok",
    symptom: "360 pasos en 5 minutos. 3,9 GB por GPU, utilización 96-100 %, ~420 img/s. kNN 0,976 → 0,983 (época 2) → 0,982 (época 10). collapse_ratio entre 0,98 y 1,00.",
    cause: "Las dos GPUs sincronizan gradientes por NCCL sobre PCIe sin problema para un ViT-S.",
    fix: "El proceso corrió con setsid nohup y sobrevivió a cerrar la pestaña del terminal.",
  },
  {
    time: "20:31",
    title: "Reanudar desde checkpoint",
    status: "ok",
    symptom: "Retomó en época 10 / paso 360 y corrió la época 11: kNN 0,983.",
    cause: "El checkpoint guarda modelo, optimizador, época y paso, y se escribe de forma atómica (tmp + rename).",
    fix: "Un run interrumpido por otro estudiante o por el pod se retoma sin perder trabajo.",
  },
  {
    time: "02:06",
    title: "TensorBoard por URL",
    status: "pending",
    symptom: "/user/<usuario>/proxy/6006/ responde 404.",
    cause: "jupyter-server-proxy no está en la imagen. Lo instalamos y funcionó, pero el pod se recrea al reiniciar y /opt/conda vuelve al estado de la imagen (lo verificamos con archivos marcador).",
    fix: "Una línea en el Dockerfile de la imagen: pip install jupyter-server-proxy. Pedido a Alfredo. Mientras tanto: event files descargados y TensorBoard local.",
  },
  {
    time: "19:31",
    title: "Permisos en el home NFS",
    status: "pending",
    symptom: "Permission denied al borrar o escribir en proyecto/, datos/ y runs/. chmod: Operation not permitted.",
    cause: "Todo lo escrito antes del 17 de septiembre ~08:30 quedó con dueño 65534 (nobody); lo posterior sale como uid 1000. El uid del pod no cambia al reiniciar (medido): cambió el mapeo del export NFS.",
    fix: "chown -R 1000:100 sobre el home, pedido a Alfredo. Mientras tanto trabajamos en carpetas nuevas, que sí son nuestras.",
  },
];

export const NEXT_STEPS = [
  {
    title: "Aumentación en GPU",
    body: "Con workers=0 la CPU decodifica JPEG en el proceso principal y deja la GPU esperando. Mover crop, flip, jitter y blur a la GPU (o preprocesar a tensores) para medir el throughput real y el escalado 1 vs 2 GPUs.",
  },
  {
    title: "Clonar el repo del proyecto de grado en ~/work/v6",
    body: "Aplicar el mismo congelado de mask_token y el fallback de workers al scripts/pretrain.py, y correr el smoke de dino_continual sobre el pool de HAM10000 que ya está en el clúster.",
  },
  {
    title: "Estresar la VRAM",
    body: "ViT-B/14 a 224 px con batch 128 debería rozar los 24 GB. Sirve para fijar el batch máximo de las corridas reales.",
  },
  {
    title: "Pendientes con Alfredo",
    body: "jupyter-server-proxy en la imagen, chown del home NFS, y el usuario de Paula (msaavedra516) que no puede iniciar sesión.",
  },
];
