/* eslint-disable sonarjs/no-duplicate-string */
/* eslint-disable import/no-cycle */
import { Injectable } from '@angular/core';

//import { DialogModalService, ModalSize } from "./dialog-modal.service";

@Injectable({
  providedIn: 'root',
})
export class DialogUtilsService {
  //private dialogService = inject(DialogModalService);
  // private readonly defaultScreenConfig = {
  //     maximizable: true,
  //     duplicate: true,
  //     styleClass: "modal-sem-espacamento",
  //     width: ModalSize.XL
  // };
  // openCliente(codCliente: number | string, subtext?: string, mode: "view" | "edit" | "create" = "view") {
  //     return this.dialogService.open(ClientesFormComponent, {
  //         ...this.defaultScreenConfig,
  //         title: mode === "create" ? "Novo Cliente" : "Visualizar Cliente",
  //         subtext: subtext || (mode === "create" ? "Cadastro" : `Código: ${codCliente}`),
  //         anchors: [
  //             { label: "Identificação", targetId: "sec-identificacao" },
  //             { label: "Endereço", targetId: "sec-endereco" },
  //             { label: "Adicionais", targetId: "sec-adicionais" },
  //             { label: "Envio de CT-e", targetId: "sec-envio-cte" },
  //             { label: "Desconto Quebra", targetId: "sec-desconto-quebra" },
  //             { label: "Informações SERPRO", targetId: "sec-info-serpro" },
  //             { label: "Observações", targetId: "sec-observacoes" },
  //             { label: "Contatos", targetId: "sec-contatos" }
  //         ],
  //         styleClass: "modal-sem-espacamento",
  //         data: {
  //             codCliente,
  //             mode
  //         }
  //     });
  // }
}
