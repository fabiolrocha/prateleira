import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Botao } from '../components/Botao';
import { Campo } from '../components/Campo';
import { Checkbox } from '../components/Checkbox';
import { EstadoVazio } from '../components/EstadoVazio';
import { useListaCompras } from '../contexts/ListaComprasContext';
import { useToast } from '../contexts/ToastContext';
import type { ItemCompra } from '../models/ItemCompra';
import { bordas, cores, espacamentoLetras, espacos, fontes, tamanhos } from '../tema';
import { fundoPressionado } from '../utils/estiloPressionado';

type Grupo = {
  chave: string;
  rotulo: string;
  itens: ItemCompra[];
};

export function Lista() {
  const { itens, adicionarManual, alternarCarrinho } = useListaCompras();
  const { mostrar } = useToast();
  const [nome, setNome] = useState('');

  const noCarrinho = itens.filter((item) => item.noCarrinho);
  const grupos: Grupo[] = [
    {
      chave: 'acabou',
      rotulo: '[ ACABOU EM CASA ]',
      itens: itens.filter((item) => !item.noCarrinho && item.origem === 'automatico'),
    },
    {
      chave: 'manuais',
      rotulo: '[ ADICIONADOS POR VOCÊ ]',
      itens: itens.filter((item) => !item.noCarrinho && item.origem === 'manual'),
    },
    { chave: 'carrinho', rotulo: '[ NO CARRINHO ]', itens: noCarrinho },
  ];

  async function adicionar() {
    if (!nome.trim()) return;
    const nomeFinal = nome.trim();
    setNome('');
    await adicionarManual(nomeFinal);
    mostrar(`${nomeFinal} adicionado à lista`, 'sucesso');
  }

  return (
    <ScrollView
      style={styles.tela}
      contentContainerStyle={styles.conteudo}
      keyboardShouldPersistTaps="handled"
    >
      <View style={styles.cabecalho}>
        <Text style={styles.titulo}>Lista de compras</Text>
        <Text style={styles.subtitulo}>
          {itens.length} itens, {noCarrinho.length} já no carrinho
        </Text>
      </View>

      <View style={styles.adicionar}>
        <View style={styles.campo}>
          <Campo
            value={nome}
            onChangeText={setNome}
            placeholder="Adicionar item"
            accessibilityLabel="Nome do item"
          />
        </View>
        <View style={styles.botao}>
          <Botao
            titulo=""
            icone="plus"
            rotuloAcessibilidade="Adicionar item"
            onPress={adicionar}
            desabilitado={!nome.trim()}
          />
        </View>
      </View>

      {itens.length === 0 && <EstadoVazio frase="Sua lista está vazia. Adicione um item acima." />}

      {grupos.map((grupo) =>
        grupo.itens.length === 0 ? null : (
          <View key={grupo.chave} style={styles.grupo}>
            <Text style={styles.rotulo}>{grupo.rotulo}</Text>
            {grupo.itens.map((item) => (
              <Pressable
                key={item.id}
                onPress={() => alternarCarrinho(item.id)}
                accessibilityRole="button"
                accessibilityLabel={item.noCarrinho ? `Tirar ${item.nome} do carrinho` : `Pôr ${item.nome} no carrinho`}
                style={({ pressed }) => [styles.linha, fundoPressionado(pressed)]}
              >
                <Checkbox marcado={item.noCarrinho} onChange={() => alternarCarrinho(item.id)} />
                <View style={styles.textos}>
                  <Text style={[styles.nome, item.noCarrinho && styles.riscado]}>{item.nome}</Text>
                  {item.descricao() !== '' && (
                    <Text style={[styles.quantidade, item.noCarrinho && styles.riscado]}>
                      {item.descricao()}
                    </Text>
                  )}
                </View>
              </Pressable>
            ))}
          </View>
        ),
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  tela: {
    flex: 1,
    backgroundColor: cores.fundo,
  },
  conteudo: {
    padding: espacos.xl,
    gap: espacos.xl,
  },
  cabecalho: {
    gap: espacos.xs,
  },
  titulo: {
    color: cores.destaque,
    fontFamily: fontes.extranegrito,
    fontSize: tamanhos.display,
  },
  subtitulo: {
    color: cores.texto,
    fontFamily: fontes.regular,
    fontSize: tamanhos.corpo,
  },
  adicionar: {
    flexDirection: 'row',
    gap: espacos.sm,
  },
  campo: {
    flex: 1,
  },
  botao: {
    width: 52,
  },
  grupo: {
    gap: espacos.md,
  },
  rotulo: {
    color: cores.rotulo,
    fontFamily: fontes.medio,
    fontSize: tamanhos.legenda,
    letterSpacing: espacamentoLetras.largo,
  },
  linha: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: espacos.md,
    paddingVertical: espacos.sm,
    borderBottomWidth: bordas.largura,
    borderBottomColor: cores.linha,
  },
  textos: {
    flex: 1,
    gap: espacos.xs,
  },
  nome: {
    color: cores.destaque,
    fontFamily: fontes.regular,
    fontSize: tamanhos.corpo,
  },
  quantidade: {
    color: cores.apagado,
    fontFamily: fontes.regular,
    fontSize: tamanhos.legenda,
  },
  riscado: {
    textDecorationLine: 'line-through',
    opacity: 0.5,
  },
});
