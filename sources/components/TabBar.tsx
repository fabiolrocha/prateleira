import type { ComponentProps } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { bordas, cores, espacamentoLetras, espacos, fontes, raios, tamanhos, toque } from '../tema';

type NomeIcone = ComponentProps<typeof Feather>['name'];

const ROTULOS: Record<string, string> = {
  Home: 'Home',
  Despensa: 'Despensa',
  Lista: 'Lista',
  Ajustes: 'Ajustes',
};

const ICONES: Record<string, NomeIcone> = {
  Home: 'home',
  Despensa: 'archive',
  Lista: 'check-square',
  Ajustes: 'sliders',
};

const TAMANHO_QUADRADO = toque.minimo;

export function TabBar({ state, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.barra, { paddingBottom: espacos.sm + insets.bottom }]}>
      {state.routes.map((rota, indice) => {
        const ativa = state.index === indice;
        const rotulo = ROTULOS[rota.name] ?? rota.name;

        function aoTocar() {
          const evento = navigation.emit({
            type: 'tabPress',
            target: rota.key,
            canPreventDefault: true,
          });
          if (!ativa && !evento.defaultPrevented) {
            navigation.navigate(rota.name);
          }
        }

        return (
          <Pressable
            key={rota.key}
            onPress={aoTocar}
            accessibilityRole="tab"
            accessibilityLabel={rotulo}
            accessibilityState={{ selected: ativa }}
            style={styles.aba}
          >
            <View style={[styles.quadrado, ativa && styles.quadradoAtivo]}>
              <Feather
                name={ICONES[rota.name] ?? 'circle'}
                size={20}
                color={ativa ? cores.sobreDestaque : cores.apagado}
              />
            </View>
            <Text style={[styles.rotulo, ativa && styles.rotuloAtivo]}>{rotulo}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  barra: {
    flexDirection: 'row',
    backgroundColor: cores.painel,
    borderTopWidth: bordas.largura,
    borderTopColor: cores.linha,
    paddingTop: espacos.sm,
    paddingHorizontal: espacos.sm,
  },
  aba: {
    flex: 1,
    minHeight: toque.minimo,
    alignItems: 'center',
    justifyContent: 'center',
    gap: espacos.xs,
  },
  quadrado: {
    width: TAMANHO_QUADRADO,
    height: TAMANHO_QUADRADO - espacos.sm,
    borderRadius: raios.nenhum,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quadradoAtivo: {
    backgroundColor: cores.destaque,
  },
  rotulo: {
    fontFamily: fontes.regular,
    fontSize: tamanhos.micro,
    letterSpacing: espacamentoLetras.largo,
    textTransform: 'uppercase',
    color: cores.apagado,
  },
  rotuloAtivo: {
    fontFamily: fontes.medio,
    color: cores.rotulo,
  },
});
