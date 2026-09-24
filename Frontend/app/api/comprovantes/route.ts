import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import crypto from "crypto";

export const runtime = "nodejs";

const DATA_DIR = path.join(process.cwd(), "data");
const DATA_FILE = path.join(DATA_DIR, "comprovantes.json");
const UPLOADS_DIR = path.join(process.cwd(), "public", "uploads");
const MAX_BYTES = 8 * 1024 * 1024; // 8MB

type Entry = {
  id: string;
  name: string;
  fileName: string;
  fileType: string;
  filePath: string;
  submittedAt: string;
};

async function ensureDirs() {
  await fs.mkdir(DATA_DIR, { recursive: true });
  await fs.mkdir(UPLOADS_DIR, { recursive: true });
}

async function readEntries(): Promise<Entry[]> {
  try {
    const raw = await fs.readFile(DATA_FILE, "utf-8");
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

async function writeEntries(entries: Entry[]) {
  await fs.writeFile(DATA_FILE, JSON.stringify(entries, null, 2), "utf-8");
}

function slugify(str: string) {
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export async function GET() {
  await ensureDirs();
  const entries = await readEntries();
  entries.sort(
    (a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime()
  );
  return NextResponse.json({ entries });
}

export async function POST(req: NextRequest) {
  await ensureDirs();

  const form = await req.formData();
  const name = form.get("name");
  const file = form.get("file");

  if (typeof name !== "string" || !name.trim()) {
    return NextResponse.json({ error: "Nome inválido." }, { status: 400 });
  }
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Arquivo não enviado." }, { status: 400 });
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json(
      { error: "Arquivo muito grande. Envie um arquivo de até 8MB." },
      { status: 400 }
    );
  }

  const ext = (file.name.split(".").pop() || "bin").toLowerCase().replace(/[^a-z0-9]/g, "");
  const filename = `${slugify(name)}-${Date.now()}-${crypto.randomBytes(4).toString("hex")}.${ext}`;
  const buffer = Buffer.from(await file.arrayBuffer());
  await fs.writeFile(path.join(UPLOADS_DIR, filename), buffer);

  const entry: Entry = {
    id: crypto.randomUUID(),
    name: name.trim(),
    fileName: file.name,
    fileType: file.type,
    filePath: `/uploads/${filename}`,
    submittedAt: new Date().toISOString(),
  };

  const entries = await readEntries();
  entries.push(entry);
  await writeEntries(entries);

  return NextResponse.json({ entry }, { status: 201 });
}
