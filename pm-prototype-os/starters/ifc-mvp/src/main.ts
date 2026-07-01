import { IfcViewerAPI } from "web-ifc-viewer";
import { Color } from "three";
import {
  IFCWALL,
  IFCWALLSTANDARDCASE,
  IFCDOOR,
  IFCWINDOW,
  IFCSLAB,
  IFCCOLUMN,
  IFCBEAM,
  IFCSTAIR,
  IFCSTAIRFLIGHT,
  IFCROOF,
  IFCSPACE,
  IFCFURNISHINGELEMENT,
  IFCFLOWSEGMENT,
  IFCFLOWFITTING,
  IFCFLOWTERMINAL,
  IFCPIPESEGMENT,
  IFCMEMBER,
  IFCPLATE,
} from "web-ifc";

// ============================================================
// PM Prototype OS — IFC MVP Starter
// cards/ifc_analysis.md の「IFC Upload → Model Summary →
// Element Table → Missing Attribute Check → Review Report」の
// 前半（Upload〜Element Table〜属性表示）を実際に動く形にしたもの。
//
// 目的は本番実装ではなく、顧客に「これでIFCの中身がすぐ見える」
// と伝わる最小デモ。属性欠損チェック・レポート出力は次段階で追加する。
// ============================================================

// 確認対象のIFCカテゴリ。Arent領域で頻出する種類に絞っている。
// 増やしたい場合は 'web-ifc' からエクスポートされている IFCxxxx 定数を追加する。
const TRACKED_CATEGORIES: Array<{ label: string; type: number }> = [
  { label: "壁 (IfcWall)", type: IFCWALL },
  { label: "壁（標準）(IfcWallStandardCase)", type: IFCWALLSTANDARDCASE },
  { label: "ドア (IfcDoor)", type: IFCDOOR },
  { label: "窓 (IfcWindow)", type: IFCWINDOW },
  { label: "スラブ (IfcSlab)", type: IFCSLAB },
  { label: "柱 (IfcColumn)", type: IFCCOLUMN },
  { label: "梁 (IfcBeam)", type: IFCBEAM },
  { label: "階段 (IfcStair)", type: IFCSTAIR },
  { label: "階段部材 (IfcStairFlight)", type: IFCSTAIRFLIGHT },
  { label: "屋根 (IfcRoof)", type: IFCROOF },
  { label: "室 (IfcSpace)", type: IFCSPACE },
  { label: "什器 (IfcFurnishingElement)", type: IFCFURNISHINGELEMENT },
  { label: "配管セグメント (IfcFlowSegment)", type: IFCFLOWSEGMENT },
  { label: "配管継手 (IfcFlowFitting)", type: IFCFLOWFITTING },
  { label: "配管末端 (IfcFlowTerminal)", type: IFCFLOWTERMINAL },
  { label: "配管 (IfcPipeSegment)", type: IFCPIPESEGMENT },
  { label: "部材 (IfcMember)", type: IFCMEMBER },
  { label: "プレート (IfcPlate)", type: IFCPLATE },
];

const container = document.getElementById("viewer-container") as HTMLElement;
const dropHint = document.getElementById("drop-hint") as HTMLElement;
const statusEl = document.getElementById("status") as HTMLElement;
const listEl = document.getElementById("element-list") as HTMLUListElement;
const propsEl = document.getElementById("props") as HTMLElement;
const fileInput = document.getElementById("file-input") as HTMLInputElement;

const viewer = new IfcViewerAPI({
  container,
  backgroundColor: new Color(0xeef1f5),
});

viewer.axes.setAxes();
viewer.grid.setGrid();
// public/ にコピーしたwasmを読む（scripts/copy-wasm.mjs 参照）
viewer.IFC.setWasmPath("./");

let currentModelID: number | null = null;

function setStatus(text: string): void {
  statusEl.textContent = text;
}

async function loadIfcFromFile(file: File): Promise<void> {
  dropHint.style.display = "none";
  setStatus(`読み込み中: ${file.name} ...`);
  listEl.innerHTML = "";
  propsEl.textContent = "";

  const url = URL.createObjectURL(file);
  try {
    const model = await viewer.IFC.loadIfcUrl(url);
    currentModelID = model.modelID;
    setStatus(`読み込み完了: ${file.name}`);
    await buildElementList(model.modelID);
  } catch (err) {
    console.error(err);
    setStatus(`読み込み失敗: ${(err as Error).message ?? err}`);
  } finally {
    URL.revokeObjectURL(url);
  }
}

async function buildElementList(modelID: number): Promise<void> {
  listEl.innerHTML = "";
  const ifcManager = viewer.IFC.loader.ifcManager;

  for (const { label, type } of TRACKED_CATEGORIES) {
    let ids: number[] = [];
    try {
      ids = await ifcManager.getAllItemsOfType(modelID, type, false);
    } catch {
      // このIFCスキーマ/バージョンに存在しない型はスキップする
      continue;
    }
    if (!ids || ids.length === 0) continue;

    const groupLi = document.createElement("li");
    groupLi.style.flexDirection = "column";
    groupLi.style.alignItems = "stretch";
    groupLi.style.cursor = "default";

    const header = document.createElement("div");
    header.style.display = "flex";
    header.style.justifyContent = "space-between";
    header.style.fontWeight = "600";
    header.innerHTML = `<span>${label}</span><span class="count">${ids.length}</span>`;
    groupLi.appendChild(header);

    // 件数が多いカテゴリはUIが重くなるため、先頭20件だけクリック可能にする
    const shown = ids.slice(0, 20);
    for (const id of shown) {
      const itemLi = document.createElement("div");
      itemLi.style.padding = "2px 8px";
      itemLi.style.fontSize = "12px";
      itemLi.style.color = "#556";
      itemLi.style.cursor = "pointer";
      itemLi.textContent = `#${id}`;
      itemLi.addEventListener("click", () => showProperties(modelID, id));
      groupLi.appendChild(itemLi);
    }
    if (ids.length > shown.length) {
      const more = document.createElement("div");
      more.style.fontSize = "11px";
      more.style.color = "#99a";
      more.textContent = `...ほか${ids.length - shown.length}件`;
      groupLi.appendChild(more);
    }

    listEl.appendChild(groupLi);
  }

  if (listEl.children.length === 0) {
    const empty = document.createElement("li");
    empty.textContent = "対象カテゴリの部材が見つかりませんでした。";
    listEl.appendChild(empty);
  }
}

async function showProperties(modelID: number, expressID: number): Promise<void> {
  try {
    const props = await viewer.IFC.getProperties(modelID, expressID, true, false);
    renderProps(props);
    await viewer.IFC.selector.pickIfcItemsByID(modelID, [expressID], true);
  } catch (err) {
    propsEl.textContent = `属性取得に失敗しました: ${(err as Error).message ?? err}`;
  }
}

function renderProps(props: Record<string, unknown>): void {
  const rows: string[] = [];
  const missing: string[] = [];

  const flat = flattenProps(props);
  for (const [key, value] of Object.entries(flat)) {
    if (value === null || value === undefined || value === "") {
      missing.push(key);
      continue;
    }
    rows.push(`<tr><td>${escapeHtml(key)}</td><td>${escapeHtml(String(value))}</td></tr>`);
  }

  let html = `<table>${rows.join("")}</table>`;
  if (missing.length > 0) {
    html += `<div style="margin-top:8px;font-size:11px;color:#c0392b;">属性欠損候補: ${missing
      .map(escapeHtml)
      .join(", ")}</div>`;
  }
  propsEl.innerHTML = html;
}

// IFCの階層的なプロパティオブジェクトを、表示しやすい key: value に平坦化する。
// 本番のIFC属性欠損チェック（cards/ifc_analysis.md）では、ここをルールベースの
// チェックエンジンに差し替える想定。
function flattenProps(props: Record<string, unknown>): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  const interesting = [
    "GlobalId",
    "Name",
    "Description",
    "ObjectType",
    "Tag",
    "PredefinedType",
  ];
  for (const key of interesting) {
    const raw = (props as any)[key];
    out[key] = raw && typeof raw === "object" && "value" in raw ? raw.value : raw ?? null;
  }
  return out;
}

function escapeHtml(text: string): string {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

// ---- ファイル入力（ドラッグ&ドロップ + ボタン選択）----

fileInput.addEventListener("change", () => {
  const file = fileInput.files?.[0];
  if (file) void loadIfcFromFile(file);
});

container.addEventListener("dragover", (e) => {
  e.preventDefault();
  dropHint.style.background = "rgba(47,111,237,0.06)";
});

container.addEventListener("dragleave", () => {
  dropHint.style.background = "transparent";
});

container.addEventListener("drop", (e) => {
  e.preventDefault();
  dropHint.style.background = "transparent";
  const file = e.dataTransfer?.files?.[0];
  if (file) void loadIfcFromFile(file);
});

// 未使用変数警告よけ（将来モデル切り替えUIを足すときに使う）
void currentModelID;
