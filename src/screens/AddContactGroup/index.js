import React, {useState, useEffect} from 'react';
import {View, FlatList} from 'react-native';
import styles from './styles';
import Group from '../../components/Group';
import { useNavigation } from '@react-navigation/native';
// import openDatabase hook
import { openDatabase } from "react-native-sqlite-storage";

// use hook to create database
const myContactsDB = openDatabase({name: 'MyContacts.db'});
const groupsTableName = 'groups';

const AddContactGroupScreen = props => {

  const post = props.route.params.post;

  const navigation = useNavigation();
  const [groups, setGroups] = useState([]);

  useEffect(() => {
    const listener = navigation.addListener('focus', () => {
      // declare an empty array that will store the results of the
      // SELECT
      let results = [];
      // declare a transaction that will execute the SELECT
      myContactsDB.transaction(txn => {
        // execute SELECT
        txn.executeSql(
          `SELECT * FROM ${groupsTableName}`,
          [],
          // callback function to handle the results from the
          // SELECT
          (_, res) => {
            // get number of rows of data selected
            let len = res.rows.length;
            console.log('Length of groups ' + len);
            // if more than one row was returned
            if (len > 0){
              // loop through the rows
              for (let i = 0; i < len; i++){
                // push a row of data at a time onto the
                // resutls array
                let item = res.rows.item(i);
                results.push({
                  id: item.id,
                  name: item.name,
                  description: item.description,
                  contact_id: post.id,
                });
              }
              // assign results array to group state variable
              setGroups(results);
            } else {
              // if no rows of data were returned,
              // set groups state variable to an empty array
              setGroups([]);
            }
          },
          error => {
            console.log('Error getting groups ' + error.message);
          },
        )
      });
    });
    return listener;
  });

  return (
    <View style={styles.container}>
      <FlatList
        data={groups}
        renderItem={({item}) => <Group post={item} />}
        keyExtractor={item => item.id}
        />
    </View>
  );
};

export default AddContactGroupScreen;