// import logo from './logo.svg';
// import './App.css';

import '@aws-amplify/ui-react/styles.css';
import {
  withAuthenticator,
  // AmplifySignOut,
  Button,
  // Heading,
  // Image,
  // View,
  // Card
} from "@aws-amplify/ui-react";

import React, {useState, useEffect} from "react";
import {API} from "aws-amplify";
import {listNotes} from "./graphql/queries";
import {createNote as createNoteMutation, deleteNote as deleteNoteMutation} from "./graphql/mutations";

const initialFormState = {name: "", description: ""};

function App({signOut}) {
  const [notes, setNotes] = useState([]);
  const [formData, setFormData] = useState(initialFormState);

  useEffect(() => {
    fetchNotes()
  }, []);

  async function fetchNotes() {
    const apiData = await API.graphql({query: listNotes});
    setNotes(apiData.data.listNotes.items);
  }

  async function createNote() {
    if (!formData.name || !formData.description) {
      return;
    }

    await API.graphql({query: createNoteMutation, variables: {input: formData}});
    setNotes([...notes, formData]);
    setFormData(initialFormState);
  }

  async function deleteNote({id}) {
    const newNotesArray = notes.filter(note => note.id !== id);
    setNotes(newNotesArray);
    await API.graphql({query: deleteNoteMutation, variables: {input: {id}}});
  }

  return (
    <div className='App'>
      <h1>My Notes</h1>
      <input
        onChange={e => setFormData({...formData, "name": e.target.value})}
        placeholder="Note name"
        value={formData.name}
      />
      <input
        onChange={e => setFormData({...formData, "description": e.target.value})}
        placeholder="Note description"
        value={formData.description}
      />
      <button onClick={createNote}>Create Note</button>
      <div style={{marginBotton: 30}}>
        {
          notes.map(note => (
            <div>
              <h2>{note.name}</h2>
              <p>{note.description}</p>
              <button onClick={()=>deleteNote(note)}>Delete</button>
            </div>
          ))
        }
      </div>
      {/* <AmplifySignOut /> */}
      <Button onClick={signOut}>Sign Out</Button>
    </div>
    // <View className="App">
    //   <Card>
    //     <Image src={logo} className="App-logo" alt="logo" />
    //     <Heading level={1}>We now have Auth!</Heading>
    //   </Card>
    //   <Button onClick={signOut}>Sign Out</Button>
    // </View>
  );
}

export default withAuthenticator(App);
