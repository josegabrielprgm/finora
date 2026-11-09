import { Component, OnDestroy, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

interface Particula {
  id: number;
  emoji: string;
  x: number; // posição horizontal em %
  atraso: number; // segundos
  duracao: number; // segundos
  tamanho: number; // rem
  desvio: number; // px que ela "balança" para o lado
}

const EMOJIS_FUNDO = ['💖', '💗', '🌸', '✨', '💕', '🦋'];
const EMOJIS_CHUVA = ['💖', '💝', '🌷', '⭐', '💗', '🎀', '🌸'];

/** Cria partículas com posições aleatórias. Gerado uma vez, não a cada detecção de mudança. */
function gerarParticulas(quantidade: number, emojis: string[], idInicial = 0): Particula[] {
  return Array.from({ length: quantidade }, (_, i) => ({
    id: idInicial + i,
    emoji: emojis[Math.floor(Math.random() * emojis.length)],
    x: Math.random() * 100,
    atraso: Math.random() * 6,
    duracao: 5 + Math.random() * 5,
    tamanho: 0.9 + Math.random() * 1.1,
    desvio: (Math.random() - 0.5) * 60,
  }));
}

/** Homenagem fofa para a Samara: corações flutuando, brilhos e chuva de confete ao clicar. */
@Component({
  imports: [MatButtonModule, MatIconModule],
  selector: 'app-saudacao-samara',
  styleUrl: './saudacao-samara.scss',
  templateUrl: './saudacao-samara.html',
})
export class SaudacaoSamara implements OnDestroy {
  protected readonly visivel = signal(true);
  protected readonly coracoes = gerarParticulas(14, EMOJIS_FUNDO);
  protected readonly chuva = signal<Particula[]>([]);

  private proximoId = 1000;
  private timers: ReturnType<typeof setTimeout>[] = [];

  celebrar(): void {
    const novas = gerarParticulas(24, EMOJIS_CHUVA, this.proximoId).map((p) => ({
      ...p,
      atraso: Math.random() * 0.6,
      duracao: 2.2 + Math.random() * 1.5,
    }));
    this.proximoId += novas.length;
    this.chuva.update((atual) => [...atual, ...novas]);

    // Remove as partículas depois que a animação termina, para o DOM não crescer sem parar
    const ids = new Set(novas.map((p) => p.id));
    this.timers.push(setTimeout(() => this.chuva.update((atual) => atual.filter((p) => !ids.has(p.id))), 4500));
  }

  fechar(): void {
    this.visivel.set(false);
  }

  ngOnDestroy(): void {
    this.timers.forEach(clearTimeout);
  }
}
