import { StyleSheet, Text, View } from 'react-native';
import { socket } from './Socket.io';
import { useEffect, useState } from 'react';

export default function Notification() {
  const [isConnected, setIsConnected] = useState(false);
  const [transport, setTransport] = useState('N/A');
const [message,setMessage] = useState([]) 
  useEffect(() => {
    if (socket.connected) {
      onConnect();
    }

    function onConnect() {
      setIsConnected(true);
      setTransport(socket.io.engine.transport.name);

      socket.io.engine.on('upgrade', (transport) => {
        setTransport(transport.name);
      });
    }

    function onDisconnect() {
      setIsConnected(false);
      setTransport('N/A');
    }

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);

    socket.on('newNotification',(notification)=>{
        console.log(notification)
        setMessage(notification.message)
    })
    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
    };
  }, []);

  return (
    <View style={styles.container}>
      <Text>Status: { isConnected ? 'connected' : 'disconnected' }</Text>
      <Text>Transport: { transport }</Text>
      <Text>Message{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});