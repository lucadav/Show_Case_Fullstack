import React, { useState } from "react";
import Header from "./Header";
import Footer from "./Footer";
import Note from "./Note";
import CreateArea from "./CreateArea";
import Axios from 'axios';


function App() {
  const [notes, setNotes] = useState([]);

 
  function getInitialValues(params) {
    Axios.get('http://localhost:3000/articles')
      .then(function (response) {
        setNotes(response.data)
      })
      .catch(function (error) {
        console.log(error);
      })
  } 



  function addNote(newNote) {
    Axios.post('http://localhost:3000/articles', {
      title: newNote.title,
      content: newNote.content
    })
    .then(function (response) {
      setNotes(prevNotes => {
        return [...prevNotes, response.data];
      });
    })
    .catch(function (error) {
      console.log(error);
    });
    
  }

  function deleteNote(id) {
    Axios.post('http://localhost:3000/articles', {
      delete: true,
      id: id
    })
    .then(function (response) {
      getInitialValues()
    })
    .catch(function (error) {
      console.log(error);
    });
  }

  return (
    <div>
      <Header />
      <CreateArea onLoad={getInitialValues}  onAdd={addNote} />
      {
        notes.map((noteItem, index) => {
        return (
          <Note
            key={index}
            id={noteItem._id}
            title={noteItem.title}
            content={noteItem.content}
            onDelete={deleteNote}
          />
        );
      })}
      <Footer />
    </div>
  );
}

export default App;
