import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class InputActionsService {
  copyContent(value: string) {
    navigator.clipboard.writeText(value);
  }

  redirectToWhatsApp(value: string) {
    const countryCode = '55';
    const formattedNumber = value.replace(/\D/g, '');
    const whatsappUrl = `https://wa.me/${countryCode}${formattedNumber}`;
    window.open(whatsappUrl, '_blank');
  }

  redirectToEmail(email: string) {
    const mailtoUrl = `mailto:${email}?subject=${encodeURIComponent('')}&body=${encodeURIComponent('')}`;
    window.location.href = mailtoUrl;
  }

  redirectToGoogleMpas(origem: string, destino: string) {
    const url = `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(
      origem,
    )}&destination=${encodeURIComponent(destino)}&travelmode=driving`;

    window.open(url, '_blank');
  }
}
