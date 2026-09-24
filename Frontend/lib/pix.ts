/**
 * Gerador de payload Pix (BR Code / EMV), no padrão do Banco Central.
 */

function crc16(str: string): string {
  let crc = 0xffff;
  for (let i = 0; i < str.length; i++) {
    crc ^= str.charCodeAt(i) << 8;
    for (let j = 0; j < 8; j++) {
      crc = crc & 0x8000 ? (crc << 1) ^ 0x1021 : crc << 1;
      crc &= 0xffff;
    }
  }
  return crc.toString(16).toUpperCase().padStart(4, "0");
}

function tlv(id: string, value: string): string {
  const len = String(value.length).padStart(2, "0");
  return `${id}${len}${value}`;
}

export function buildPixPayload({
  chave,
  nome,
  cidade,
  valor,
  txid,
}: {
  chave: string;
  nome: string;
  cidade: string;
  valor: number;
  txid?: string;
}): string {
  const gui = tlv("00", "br.gov.bcb.pix");
  const key = tlv("01", chave);
  const merchantAccount = tlv("26", gui + key);

  const payload =
    tlv("00", "01") +
    merchantAccount +
    tlv("52", "0000") +
    tlv("53", "986") +
    tlv("54", valor.toFixed(2)) +
    tlv("58", "BR") +
    tlv("59", nome.substring(0, 25)) +
    tlv("60", cidade.substring(0, 15)) +
    tlv("62", tlv("05", (txid || "***").substring(0, 25))) +
    "6304";

  return payload + crc16(payload);
}
