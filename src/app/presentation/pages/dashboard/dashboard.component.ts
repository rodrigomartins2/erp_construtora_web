import { Component } from '@angular/core';
import type { ChartData, ChartOptions } from 'chart.js';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  imports: []
})
export class DashboardComponent {
  // Dados de exemplo do gráfico (o gráfico está desativado no template).
  // Para exibir, importe ChartModule de 'primeng/chart' e descomente o <p-chart>.
  public barChartData: ChartData<'bar'> = {
    labels: ['Produto'],
    datasets: [
      { data: [65], label: 'Produto A' },
      { data: [60], label: 'Produto B' },
      { data: [60], label: 'Produto C' }
    ]
  };

  public barChartOptions: ChartOptions<'bar'> = {
    responsive: true,
    plugins: { legend: { display: true } }
  };
}
