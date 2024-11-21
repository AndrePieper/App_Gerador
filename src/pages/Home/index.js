import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from 'react';
import {
  StatusBar,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import { Avatar } from 'react-native-elements';
import { Container } from './styles';

export default function TelaInicial({ navigation }) {
  const [nomeUsuario, setNomeUsuario] = useState('');
  const [cpfUsuario, setCpfUsuario] = useState('');
  const [raUsuario, setRaUsuario] = useState('');
  const [fotoPerfil, setFotoPerfil] = useState(null);
  const [token, setToken] = useState('');
  const [erroToken, setErroToken] = useState('');

  // decode jwt 
  const decode_Token = (token) => {
    try {
      // padronizaçao para base 64
      const [, payload] = token.split('.');
      const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
      const base64F = base64.padEnd(base64.length + (4 - (base64.length % 4)) % 4, '=');
      const InfosDecoded = JSON.parse(atob(base64F));
      return InfosDecoded;
    } catch (erro) {
      console.error(erro);
      return null;
    }
  };

  // informações do usuário
  useEffect(() => {
    const Info_Usuario = async () => {
      try {
        const fotoSalva = await AsyncStorage.getItem('@foto_perfil');
        const tokenSalvo = await AsyncStorage.getItem('@token');

        setToken(tokenSalvo);

        if (tokenSalvo) {
          const tokenDecodificado =  decode_Token(tokenSalvo);
          if (tokenDecodificado) {
            console.log(tokenDecodificado);
            setNomeUsuario(tokenDecodificado.nome || '');
            setCpfUsuario(tokenDecodificado.cpf || '');
            setRaUsuario(tokenDecodificado.ra || '');
            await AsyncStorage.setItem('@id_aluno', tokenDecodificado.id.toString()); 
          } else {
            setErroToken('Token inválido ou expirado');
          }
        }

        if (fotoSalva) {
          setFotoPerfil(fotoSalva);
        }
      } catch (erro) {
        console.error(erro);
      }
    };

    Info_Usuario();
  }, []);

  const Foto_Usuario = () => {
    launchImageLibrary({ mediaType: 'photo' }, async (resposta) => {
        const caminhoFoto = resposta.assets[0].uri;
        setFotoPerfil(caminhoFoto);
        await AsyncStorage.setItem('@foto_perfil', caminhoFoto);
    });
  };

  return (
    <Container>
      <StatusBar backgroundColor={"#00913D"} />
      <TouchableOpacity onPress={Foto_Usuario}>
        <Avatar
          rounded
          size="xlarge"
          source={{ uri: fotoPerfil || 'https://via.placeholder.com/150' }}
          containerStyle={styles.avatar}
        />
      </TouchableOpacity>

      <View style={styles.cartao}>
        <View style={styles.viewInicial}>
          {nomeUsuario ? <Text style={styles.texto}>{`Nome: ${nomeUsuario}`}</Text> : null}
          {cpfUsuario ? <Text style={styles.texto}>{`CPF: ${cpfUsuario}`}</Text> : null}
          {raUsuario ? <Text style={styles.texto}>{`Matrícula: ${raUsuario}`}</Text> : null}
          {erroToken ? <Text style={styles.textoErro}>{erroToken}</Text> : null}
        </View>
      </View>

      <TouchableOpacity onPress={() => navigation.navigate('Gerador')}>
        <View style={styles.botaoPadrao}>
          <Text style={styles.textoBotao}>QR Code</Text>
        </View>
      </TouchableOpacity>

      <View style={styles.rodape}>
        <View style={styles.rodapeLinha}>
          <View></View>
        </View>
        <View style={styles.rodapeCentro}>
          <Text style={styles.textoRodape}>Chamada Fasipe</Text>
        </View>
        <View style={styles.rodapeLinha}>
          <View></View>
        </View>
      </View>
    </Container>
  );
}

const styles = StyleSheet.create({
  avatar: {
    marginBottom: 20,
  },
  cartao: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    marginHorizontal: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  viewInicial: {
    alignItems: 'center',
  },
  texto: {
    color: '#000000',
    fontSize: 20,
    marginBottom: 5,
    textAlign: 'center',
  },
  textoErro: {
    color: 'red',
    fontSize: 16,
    marginTop: 10,
    textAlign: 'center',
  },
  botaoPadrao: {
    backgroundColor: "#00913D",
    alignItems: 'center',
    padding: 15,
    margin: 5,
    marginTop: 20,
    borderRadius: 5,
    marginHorizontal: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  textoBotao: {
    color: "#000000",
    fontSize: 18,
  },
  rodape: {
    position: 'absolute',
    flex: 0.1,
    left: 0,
    right: 0,
    bottom: 25,
    flexDirection: 'row', 
    justifyContent: 'center', 
    alignItems: 'center', 
  },
  rodapeLinha: {
    borderBottomWidth: 2,
    borderColor: "#000",
    width: '20%', 
    marginHorizontal: 5, 
  },
  rodapeCentro: {
    alignItems: "center",
    justifyContent: "center",
  },
  textoRodape: {
    color: "#000",
    textAlign: "center",
    fontSize: 16,
  },
});