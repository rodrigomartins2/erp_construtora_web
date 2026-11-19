import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Pipe({
  name: 'safepipe',
  standalone: true
})
export class SafepipePipe implements PipeTransform {

  constructor(private sanitizer: DomSanitizer) { }
  transform(url: any) {
    return this.sanitizer.bypassSecurityTrustScript(url);
  }

}
