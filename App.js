import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, TextInput, View, FlatList } from 'react-native';
import { initializeApp } from'firebase/app';
import { getDatabase, push, remove, ref, onValue } from'firebase/database';
import { Input,Button,Header, ListItem, Icon} from'react-native-elements';



// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBYTdXVSbFnLjAyz6WHsbRA8BraT5drP6Q",
  authDomain: "ostoslista-bdc5d.firebaseapp.com",
  projectId: "ostoslista-bdc5d",
  storageBucket: "ostoslista-bdc5d.appspot.com",
  messagingSenderId: "992337539250",
  appId: "1:992337539250:web:82f25aea6d220720e399ab",
  measurementId: "G-JP53XTCR9L"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

export default function App() {
const [amount, setAmount] = useState('');
const [product, setProduct] = useState('');
const [items, setItems] = useState([]);
const [ostos, setOstos] = useState([]);

const saveItem = () => {    //viittaus ja mitä viedään
    push(  
        ref(database, 'ostot/'), //viitaus
            { 'product': product, 'amount': amount }); //olio
}

const deleteItem = (item) => {    //viittaus ja mitä poistetaan
 // console.log ('deleteItem', items);
 // console.log ('deleteItem',  item);
  remove(ref(database, 'ostot/'+item));

}


useEffect(() => 
{const itemsRef = ref(database, 'ostot/');  
onValue(itemsRef, (snapshot) => {
  const data = snapshot.val();  
    setItems(Object.values(data)); 
    console.log(data);
    console.log(Object.values(data));
    console.log(Object.keys(data));
    const items = data ? Object.keys(data).map(key => ({ key, ...data[key]})):[];
      setOstos(items);
    });
  }, []);


 
  return (
    <View style={styles.container}>
     
    <Header    centerComponent={{ text: 'SHOPPING LIST' }} 
             />
    <Input placeholder='Product' label="Product" onChangeText={(product) => setProduct(product)} style={styles.textBoxes}  />  
   
    <Input placeholder='Amount' label="Amount" onChangeText={(amount) => setAmount(amount)} style={styles.textBoxes}/>      
    <View style={{ marginBottom:30,  alignItems:'center'}}>
    <Button icon={{name: 'save'}} title="Save"  onPress={saveItem} > </Button>
    </View >
    <View>
    <FlatList 
          data={ostos} 
          renderItem={({item}) => 
            <ListItem bottomDivider  >
              <ListItem.Content>
              <ListItem.Title>{item.product}  {item.amount} </ListItem.Title>
              </ListItem.Content>
                <Icon  raised name='delete' color='#f50'  onPress={() => deleteItem(item.key)} />
            </ListItem  > 
           } 
           keyExtractor={item => item.id}    
        />     
    </View>  
      </View>
    );
  }
  

const styles = StyleSheet.create({
  container: {
    marginTop:30,
    flex: 1,
    padding:5,
    alignContent:'center',
     
  },
  
});
