/* eslint-disable no-plusplus */
/* eslint-disable no-param-reassign */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

export interface PeriodoFormControl {
  periodoInicial: FormControl<Date | null>;
  periodoFinal: FormControl<Date | null>;
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}

export function formatDateToString(date: Date): string {
  const dia = date.getDate().toString().padStart(2, '0');
  const mes = (date.getMonth() + 1).toString().padStart(2, '0');
  const ano = date.getFullYear();
  return `${dia}/${mes}/${ano}`;
}

export function parseDateFromString(dataStr: string): Date {
  const [dia, mes, ano] = dataStr.split('/');
  return new Date(+ano, +mes - 1, +dia); // mês começa do zero
}

export function extrairCidadesEstados(rota: string): string {
  const cidadeEstadoPattern = /(\b\w+\/\w{2}\b)/g;
  const matches = rota.match(cidadeEstadoPattern);
  return matches ? matches.join(' ') : '';
}

export function extrairOrigemDestinoRota(rota: string): string[] {
  const partes = rota.split('->');
  return partes.map((parte) => parte.trim());
}

export function getInicioSemana(date: Date): Date {
  const dia = date.getDay();
  const diff = date.getDate() - dia;
  const inicioSemana = new Date(date);
  inicioSemana.setDate(diff);
  return inicioSemana;
}

export function getFimSemana(date: Date): Date {
  const dia = date.getDay();
  const diff = date.getDate() - dia + 6;
  const fimSemana = new Date(date);
  fimSemana.setDate(diff);
  return fimSemana;
}

export function removeMaskData(data: string | Date): string {
  if (data instanceof Date) {
    const dia = `0${data.getDate()}`.slice(-2);
    const mes = `0${data.getMonth() + 1}`.slice(-2);
    const ano = data.getFullYear();
    return dia + mes + ano;
  }
  const dataFormatada = data.replace(/\//g, '');
  return dataFormatada;
}

export function onChangePeriodoUtil(event: string, formControl: PeriodoFormControl) {
  formControl.periodoInicial.disable();
  formControl.periodoFinal.disable();

  if (event === 'Personalizar') {
    formControl.periodoInicial.enable();
    formControl.periodoFinal.enable();
  }
  if (event === 'Hoje') {
    const hoje = new Date();
    formControl.periodoInicial.setValue(hoje);
    formControl.periodoFinal.setValue(hoje);
  }
  if (event === 'Ontem') {
    const ontem = new Date();
    ontem.setDate(ontem.getDate() - 1);
    formControl.periodoInicial.setValue(ontem);
    formControl.periodoFinal.setValue(ontem);
  }
  if (event === 'Semana Atual') {
    const hoje = new Date();
    const inicioSemana = getInicioSemana(hoje);
    const fimSemana = getFimSemana(hoje);
    formControl.periodoInicial.setValue(inicioSemana);
    formControl.periodoFinal.setValue(fimSemana);
  }
  if (event === 'Semana Anterior') {
    const hoje = new Date();
    const inicioSemana = getInicioSemana(hoje);
    const fimSemana = getFimSemana(hoje);
    inicioSemana.setDate(inicioSemana.getDate() - 7);
    fimSemana.setDate(fimSemana.getDate() - 7);
    formControl.periodoInicial.setValue(inicioSemana);
    formControl.periodoFinal.setValue(fimSemana);
  }
}

export function RetornaSituacaoProp(situacao: string): string {
  let retorno = '';
  if (situacao === 'BLOQUEADO') {
    retorno = 'B';
  }
  if (situacao === 'ATIVO') {
    retorno = 'A';
  }
  if (situacao === 'INATIVO') {
    retorno = 'I';
  }
  if (situacao === 'RESTRITO') {
    retorno = 'R';
  }
  if (situacao === 'PROVISORIO') {
    retorno = 'P';
  }
  return retorno;
}

export function getLastChildRoute(route: ActivatedRoute): ActivatedRoute {
  while (route.firstChild) {
    route = route.firstChild;
  }
  return route;
}
export function base64ToFile(base64: string, fileName: string, mimeType: string): File {
  const byteString = atob(base64.split(',')[1] || base64);

  const byteNumbers = new Array(byteString.length);
  for (let i = 0; i < byteString.length; i++) {
    byteNumbers[i] = byteString.charCodeAt(i);
  }

  const byteArray = new Uint8Array(byteNumbers);

  const blob = new Blob([byteArray], { type: mimeType });

  return new File([blob], fileName, { type: mimeType });
}

export function formatarTelefone(telefone: string): string {
  const cleanValue = telefone.replace(/\D/g, '');

  if (cleanValue.length === 10) {
    return cleanValue.replace(/(\d{2})(\d{4})(\d{4})/, '($1)$2-$3');
  }
  if (cleanValue.length === 11) {
    return cleanValue.replace(/(\d{2})(\d{5})(\d{4})/, '($1)$2-$3');
  }
  return telefone;
}

export function getFirstInvalidControl(form: FormGroup): string | null {
  let invalidControl: string | null = null;
  Object.keys(form.controls).forEach((key) => {
    const control = form.controls[key];
    if (control.invalid && !invalidControl) {
      invalidControl = key;
    }
  });
  return invalidControl;
}

export function scrollToFirstInvalidField(form: FormGroup): void {
  if (!form) return;

  const invalidControl = getFirstInvalidControl(form);
  if (invalidControl) {
    const element = document.querySelector(`[formControlName = "${invalidControl}"]`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      (element as HTMLElement).focus();
    }
  }
}

export function formatCPF(cpf: string): string {
  if (!/^\d{11}$/.test(cpf)) {
    throw new Error('Cpf inválido');
  }
  return cpf.replace(/^(\d{3})(\d{3})(\d{3})(\d{2})$/, '$1.$2.$3-$4');
}

export function verificaCampoPreenchido<T extends Record<string, any>>(obj: T): boolean {
  return Object.values(obj).some((valor) => {
    if (typeof valor === 'string') return valor.trim() !== '';
    if (typeof valor === 'number' || typeof valor === 'boolean') return true;
    if (Array.isArray(valor)) return valor.length > 0;
    return valor !== null && valor !== undefined;
  });
}

export function formatarPlaca(placa: string): string {
  const placaSemHifen = placa.replace(/-/g, '').toUpperCase();
  const regexTradicional = /^[A-Z]{3}[0-9]{4}$/;
  const regexMercosul = /^[A-Z]{3}[0-9][A-Z][0-9]{2}$/;

  if (regexTradicional.test(placaSemHifen)) {
    return `${placaSemHifen.slice(0, 3)}-${placaSemHifen.slice(3)}`;
  }
  if (regexMercosul.test(placaSemHifen)) {
    return placaSemHifen;
  }

  return placa; // ou lançar erro / retornar null
}

export function formatarCFOP(cfop: string): string {
  const cfopComPonto = cfop.replace(/\./g, '').trim();

  if (/^\d{4}$/.test(cfopComPonto)) {
    return `${cfopComPonto[0]}.${cfopComPonto.slice(1)}`;
  }

  return cfopComPonto;
}

export function separarRuaENumero(endereco: string): { rua: string; numero: string | null } {
  const regex = /^(.*?)(?:[,|-]?\s*(\bS\/n\b|\d{1,5}(?:[A-Z]?)(?:[-/]?\w+)?|Casa\s*\d+))?$/i;
  const match = endereco.match(regex);

  if (match) {
    const rua = match[1].trim();
    const numero = match[2] ? match[2].trim() : null;
    return { rua, numero };
  }

  return { rua: endereco.trim(), numero: null };
}

export function removeAcentos(texto: string): string {
  return texto?.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

export function isIsoDateString(value: string): boolean {
  const isoDateTimeRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d+)?Z$/;
  const isoDateOnlyRegex = /^\d{4}-\d{2}-\d{2}$/;
  return isoDateTimeRegex.test(value) || isoDateOnlyRegex.test(value);
}

export function reviveDatesAndCheckboxes(key: string, value: unknown): unknown {
  if (typeof value === 'string') {
    const lower = value.toLowerCase();

    if (lower === 'true') return true;
    if (lower === 'false') return false;

    if (isIsoDateString(value)) {
      const parsed = new Date(value);
      // eslint-disable-next-line no-restricted-globals
      if (!isNaN(parsed.getTime())) {
        return new Date(parsed.getUTCFullYear(), parsed.getUTCMonth(), parsed.getUTCDate());
      }
    }
  }
  return value;
}

export function formatarDocumento(value: string): string {
  // remove tudo que não for número
  const digits = value.replace(/\D/g, '');

  if (digits.length === 11) {
    // CPF: 999.999.999-99
    return digits.replace(/^(\d{3})(\d{3})(\d{3})(\d{2})$/, '$1.$2.$3-$4');
  }

  if (digits.length === 14) {
    // CNPJ: 99.999.999/9999-99
    return digits.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, '$1.$2.$3/$4-$5');
  }

  // se não tiver 11 ou 14 dígitos, retorna original
  return value;
}

export function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    // eslint-disable-next-line prefer-promise-reject-errors
    reader.onerror = () => reject(null);
    reader.readAsDataURL(blob);
  });
}
