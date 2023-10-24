import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, TextInput, View, FlatList } from 'react-native';
import { Header, Input, Button, ListItem } from '@rneui/themed';
import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabase('shoppingdb.db');

export default function App() {
  const [product, setProduct] = useState('');
  const [ammount, setAmmount] = useState('');
  const [shoppings, setshoppings] = useState([]);

  useEffect(() => {
    db.transaction(tx => {
      tx.executeSql('create table if not exists shopping (id integer primary key not null, credits int, title text);');
    }, null, updateList);
  }, []);

  // Save shopping
  const saveItem = () => {
    db.transaction(tx => {
      tx.executeSql('insert into shopping (credits, title) values (?, ?);', [parseInt(product), ammount]);
    }, null, updateList
    )
  }

  // Update shoppinglist
  const updateList = () => {
    db.transaction(tx => {
      tx.executeSql('select * from shopping;', [], (_, { rows }) =>
        setshoppings(rows._array)
      );
    });
  }

  // Delete shopping
  const deleteItem = (id) => {
    db.transaction(
      tx => {
        tx.executeSql(`delete from shopping where id = ?;`, [id]);
      }, null, updateList
    )
  }

  /* const listSeparator = () => {
     return (
       <View
         style={{
           height: 5,
           width: "80%",
           backgroundColor: "#fff",
           marginLeft: "10%"
         }}
       />
     );
   };*/
  renderItem = ({ item }) => (
    <ListItem bottomDivider>
      <ListItem.Content>
        <ListItem.Title>{item.title}</ListItem.Title>
        <ListItem.Subtitle>{item.credits}</ListItem.Subtitle>
      </ListItem.Content>
      <ListItem.Chevron
        name="delete"
        type="material"
        color="#0000ff"
        onPress={() => deleteItem(item.id)}
      />
    </ListItem>
  )
  return (
    <View style={styles.container}>
      <Header
        leftComponent={{ icon: 'menu', color: '#fff' }}
        centerComponent={{ text: 'SHOPPING LIST', style: { color: '#fff' } }}
        rightComponent={{ icon: 'home', color: '#fff' }}
      />
      <Input placeholder='Product' style={{ marginTop: 30, fontSize: 18, width: 200 }}
        onChangeText={(ammount) => setAmmount(ammount)}
        value={ammount} />
      <Input placeholder='Ammount' keyboardType="numeric" style={{ marginTop: 5, marginBottom: 5, fontSize: 18, width: 200 }}
        onChangeText={(product) => setProduct(product)}
        value={product} />
      <Button raised icon={{ name: 'save' }} onPress={saveItem} title="Save" />
      <Text style={{ marginTop: 30, fontSize: 20 }}>Shopping list</Text>
      <FlatList
        style={styles.list}
        data={shoppings}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
      />
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
  listcontainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    alignItems: 'center'
  },

  list: {
    width: '75%'
  }

});