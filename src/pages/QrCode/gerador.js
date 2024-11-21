import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import moment from 'moment-timezone';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function GeradorQRCode({ navigation }) {
  const [idAluno, setIdAluno] = useState('');
  const [horaAtual, setHoraAtual] = useState(
    moment().tz('America/Cuiaba').toISOString()
  );

  // Carrega o ID do aluno para montar o QR Code
  useEffect(() => {
    const carregarIdAluno = async () => {
      try {
        const id = await AsyncStorage.getItem('@id_aluno');
        setIdAluno(id);
        console.log('ID recuperado do AsyncStorage:', id);
      } catch (erro) {
        console.error(erro);
      }
    };

    carregarIdAluno();
  }, []);

  // Atualiza a hora a cada 5 segundos a
  useEffect(() => {
    const intervaloHora = setInterval(() => {
      const novaHora = moment().tz('America/Cuiaba'); // .format('YYYY-MM-DDTHH:mm:ss');
      setHoraAtual(novaHora);
    }, 5000);
  
    return () => {
      clearInterval(intervaloHora);
    };
  }, []);

  return (
    <View style={estilos.container}>
      <View style={estilos.qrCodeContainer}>
        {/* Monta o QR Code */}
        <QRCode
          value={JSON.stringify({ id_aluno: idAluno, hora_post: horaAtual })}
          size={200}
        />
      </View>
      <TouchableOpacity
        style={estilos.botaoPadrao}
        onPress={() => navigation.navigate('Home')}
      >
        <Text style={estilos.botaoPadraoTexto}>Voltar</Text>
      </TouchableOpacity>
    </View>
  );
}

const estilos = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    backgroundColor: '#d9d9d9',
  },
  qrCodeContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    margin: 20,
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 20,
  },
  botaoPadrao: {
    backgroundColor: '#00913D',
    alignItems: 'center',
    padding: 15,
    borderRadius: 5,
    position: 'absolute',
    bottom: 30,
    left: 20,
    right: 20,
    marginHorizontal: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  botaoPadraoTexto: {
    color: '#000000',
    fontSize: 18,
  },
});
