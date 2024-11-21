import AsyncStorage from '@react-native-async-storage/async-storage';
import { StyleSheet, View } from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, StatusBar, Text, TextInput, TouchableOpacity, Image, Keyboard } from 'react-native';
import * as Device from 'expo-device';
import axios from 'axios';
import grupoFasipe from './grupo-fasipe.png';
import { Form } from '@unform/mobile';
import { Aviso, BoxForm, Container } from './styles';

export default function Login({ navigation }) {
  const formRef = useRef(null);
  const [Sev, setSev] = useState(null);
  const [DadosLogin, setDadosLogin] = useState({});
  const [carregando, setCarregando] = useState(false);
  const [FormValues, setFormValues] = useState({});
  const [imei, setImei] = useState('1');
  const [mensagemErro, setMensagemErro] = useState(''); 
  const [tecladoVisivel, setTecladoVisivel] = useState(false);

  // Pega o buildID para validar ou registrar
  useEffect(() => {
    const obterImei = () => {
      const imeiDispositivo = Device.osInternalBuildId || '1'; //coloca 1 quando for null para poder testar
      setImei(imeiDispositivo);
    };
    obterImei();
  }, []);

  // Adc imei
  useEffect(() => {
    if (imei) {
      setDadosLogin((prevValues) => ({
        ...prevValues,
        imei,  
      }));
    }
  }, [imei]);

  // Dados do input email e senha
  function Texto_Input(input) {
    setDadosLogin((prevValues) => ({
      ...prevValues,
      [input.name]: input.value,
    }));
  }

  // Confere o estado do teclado
  useEffect(() => {
    const MostrarTeclado = Keyboard.addListener('keyboardDidShow', () => {
      setTecladoVisivel(true); 
    });
    const EsconderTeclado = Keyboard.addListener('keyboardDidHide', () => {
      setTecladoVisivel(false); 
    });

    return () => {
      EsconderTeclado.remove();
      MostrarTeclado.remove();
    };
  }, []);

  async function Logar() {
    console.log(DadosLogin);  
    if (DadosLogin.imei && DadosLogin.email && DadosLogin.senha) {
      setCarregando(true);
      setSev(null); 
  
      try {
        const api_url = "https://projeto-iii-4.vercel.app/usuarios/login"; 
        const headers = { 'Content-Type': 'application/json' };  
  
        const resposta = await axios.post(api_url, DadosLogin, { headers: headers });
        setCarregando(false);
  
        if (resposta.status === 200 && resposta.data.auth) {
          if (resposta.data.token) {
            await AsyncStorage.setItem('@token', resposta.data.token);
            navigation.navigate('Home');
          } else {
            setSev("erro");
            setMensagemErro("Resposta da Api não contem o tokem");
          }
        } else {
          setSev("erro");
          setMensagemErro(resposta.data.message || 'Erro desconhecido! Tente novamente ou entre em contato com o suporte!');
          console.error(resposta.data);
        }
      } catch (erro) {
        setCarregando(false);
        setSev("erro");
        const mensagemErro = erro.response?.data?.message || 'Erro desconhecido! Tente novamente ou entre em contato com o suporte!';
        setMensagemErro(mensagemErro);
        console.error(erro);
      }
    }
  }
  

  return (
    <Container>
      <StatusBar backgroundColor={"#00913D"} />
      <Image source={grupoFasipe} style={styles.logo} />

      <BoxForm style={styles.boxForm}>
        <Form ref={formRef} onSubmit={Logar}>
          <Text style={styles.label}>Usuário</Text>
          <TextInput
            style={styles.input}
            onChangeText={(e) => Texto_Input({ name: "email", value: e })}
            value={DadosLogin.email || ""}
            name="email"
          />

          <Text style={styles.label}>Senha</Text>
          <TextInput
            style={styles.input}
            onChangeText={(e) => Texto_Input({ name: "senha", value: e })}
            value={DadosLogin.senha || ""}
            name="senha"
            secureTextEntry={true}
          />

          {Sev === "erro" && mensagemErro && (
            <Text style={styles.errorText}>
              {mensagemErro}
            </Text>
          )}

          <TouchableOpacity onPress={() => {
            formRef.current.submitForm();
          }}>
            <View style={styles.button}>
              <Text style={styles.buttonText}>Entrar</Text> 
            </View>
          </TouchableOpacity>

          {carregando && (
            <ActivityIndicator size="large" color="#00913D" style={styles.loader} />
          )}
        </Form>
      </BoxForm>

      {!tecladoVisivel && (
        <View style={styles.footer}>
          <View style={styles.footerRow}>
            <View style={styles.footerLine}></View>
            <Text style={styles.footerText}>Chamada Fasipe</Text>
            <View style={styles.footerLine}></View>
          </View>
        </View>
      )}
    </Container>
  );
}

const styles = StyleSheet.create({
  logo: {
    width: 400,  
    height: 100,
    resizeMode: 'contain',
    alignSelf: 'center',
    marginBottom: 20,
  },
  boxForm: {
    marginBottom: 0,
  },
  label: {
    color: "#000",
    margin: 5,
  },
  input: {
    backgroundColor: "#fff",
    color: "#737276",
    borderWidth: 1,
    borderColor: "#737276",
    borderRadius: 5,
    margin: 5,
    padding: 10
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginVertical: 10,
  },
  button: {
    backgroundColor: "#00913D",
    alignItems: 'center',
    padding: 15,
    margin: 5,
    marginTop: 20,
    borderRadius: 5,
    marginHorizontal: 20,
    marginBottom: 20,
  },
  buttonText: {
    color: "#000000",
    fontSize: 18,
  },
  loader: {
    marginBottom: 10,
    marginTop: 10,
  },
  footer: {
    position: 'absolute',
    flex: 0.1,
    left: 0,
    right: 0,
    bottom: 25,
  },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 5, 
  },
  footerLine: {
    borderBottomWidth: 2,
    borderColor: "#000",
    width: '20%', 
    marginHorizontal: 5, 
  },
  footerText: {
    color: "#000",
    textAlign: "center",
    fontSize: 16,
  },
});
