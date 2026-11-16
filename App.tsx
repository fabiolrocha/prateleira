import { useRef } from 'react';
import type { ReactNode } from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import {
  JetBrainsMono_400Regular,
  JetBrainsMono_500Medium,
  JetBrainsMono_800ExtraBold,
  useFonts,
} from '@expo-google-fonts/jetbrains-mono';
import { AjustesProvider, useAjustes } from './sources/contexts/AjustesContext';
import { DespensaProvider } from './sources/contexts/DespensaContext';
import type { IntegracoesDespensa } from './sources/contexts/DespensaContext';
import { ListaComprasProvider, useListaCompras } from './sources/contexts/ListaComprasContext';
import { ToastProvider } from './sources/contexts/ToastContext';
import { UsuarioProvider } from './sources/contexts/UsuarioContext';
import { useAbrirPelaNotificacao } from './sources/hooks/useAbrirPelaNotificacao';
import { navigationRef } from './sources/routes/navigationRef';
import { RootStack } from './sources/routes/RootStack';
import { registrarEvento } from './sources/services/historico';
import { criarAgendador } from './sources/services/notificacoes';
import { cores } from './sources/tema';

function DespensaComIntegracoes({ children }: { children: ReactNode }) {
  const { ajustes } = useAjustes();
  const ajustesRef = useRef(ajustes);
  ajustesRef.current = ajustes;

  const { adicionarAutomatico } = useListaCompras();
  const adicionarAutomaticoRef = useRef(adicionarAutomatico);
  adicionarAutomaticoRef.current = adicionarAutomatico;

  const integracoesRef = useRef<IntegracoesDespensa | null>(null);
  if (!integracoesRef.current) {
    const agendador = criarAgendador(() => ({
      avisosAtivos: ajustesRef.current.avisosAtivos,
      diasAviso: ajustesRef.current.diasAvisoPadrao,
      hora: ajustesRef.current.horaAviso,
      minuto: ajustesRef.current.minutoAviso,
    }));
    integracoesRef.current = {
      agendarAviso: agendador.agendarAviso,
      cancelarAviso: agendador.cancelarAviso,
      registrarEvento,
      reporNaLista: (produto) => adicionarAutomaticoRef.current(produto),
    };
  }

  return <DespensaProvider integracoes={integracoesRef.current}>{children}</DespensaProvider>;
}

function AbrirPelaNotificacao() {
  useAbrirPelaNotificacao();
  return null;
}

export default function App() {
  const [fontesCarregadas] = useFonts({
    JetBrainsMono_400Regular,
    JetBrainsMono_500Medium,
    JetBrainsMono_800ExtraBold,
  });

  if (!fontesCarregadas) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <UsuarioProvider>
        <AjustesProvider>
          <ListaComprasProvider>
            <DespensaComIntegracoes>
              <AbrirPelaNotificacao />
              <ToastProvider>
                <NavigationContainer
                  ref={navigationRef}
                  theme={{
                    dark: false,
                    colors: {
                      primary: cores.destaque,
                      background: cores.fundo,
                      card: cores.painel,
                      text: cores.destaque,
                      border: cores.linha,
                      notification: cores.perigo,
                    },
                    fonts: {
                      regular: { fontFamily: 'JetBrainsMono_400Regular', fontWeight: '400' },
                      medium: { fontFamily: 'JetBrainsMono_500Medium', fontWeight: '500' },
                      bold: { fontFamily: 'JetBrainsMono_800ExtraBold', fontWeight: '800' },
                      heavy: { fontFamily: 'JetBrainsMono_800ExtraBold', fontWeight: '800' },
                    },
                  }}
                >
                  <RootStack />
                  <StatusBar style="dark" />
                </NavigationContainer>
              </ToastProvider>
            </DespensaComIntegracoes>
          </ListaComprasProvider>
        </AjustesProvider>
      </UsuarioProvider>
    </SafeAreaProvider>
  );
}
