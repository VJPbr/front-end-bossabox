import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';

import { GoSearch, GoPlus } from 'react-icons/go'
import ToolItem , { Tool } from '../../components/ToolComponent/index';

import api from '../../server/api';

import './styles.css'

function Home() {
  
  const [tools, setTools] = useState([]);
  const [tagOnly, setTagOnly] = useState(false);        // utilizado na busca só por tag
  const [tag, setTag] = useState('');                   // utilizado na busca

  const [title, setTitle] = useState('');
  const [link, setLink] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState('');                 // utilizado no cadastro de ferramenta

  const [show, setShow] = useState(false);

  const customStyles = {
    content : {
      top                   : '50%',
      left                  : '50%',
      right                 : 'auto',
      bottom                : 'auto',
      marginRight           : '-50%',
      transform             : 'translate(-50%, -50%)',
    },
    overlay : {
      backgroundColor: 'rgba(0, 0, 0, 0.3)',
    }
  };

  useEffect(() => {
    if (tagOnly) {
      api.get(`/tools?tag=${tag}`).then(response => {
        setTools(response.data);
      })
    } else {
      api.get(`/tools?dynamic=${tag}`).then(response => {
        setTools(response.data);
      })
    }
  },[tools])

  async function createTool() {
    if (!title || !link || !description || !tags) {
      alert('Tool fail')
    } else {
      await api.post('/tools', {
        title,
        link,
        description,
        tags
      }).then(async () => {
        setTitle('');
        setLink('');
        setDescription('');
        setTags('');
        alert('Tool created');
        setShow(false);
      }).catch(() => {
        alert('Erro');
      })
    }
    
  }

  return (
    <div id="home">

      <Modal
        isOpen={show} 
        style={customStyles}
        onRequestClose={() => setShow(false)}
      >
        <div className="modal-create">
          <h2>Create new tool</h2>
          <p>Tool name</p>
          <textarea name="tool-title" onChange={(e) => {setTitle(e.target.value)}}></textarea>
          <p>Tool link</p>
          <textarea name="tool-link" onChange={(e) => {setLink(e.target.value)}}></textarea>
          <p>Tool description</p>
          <textarea className="tool-description" onChange={(e) => {setDescription(e.target.value)}}></textarea>
          <p>Tool tags</p>
          <textarea name="tool-tags" onChange={(e) => {setTags(e.target.value)}}></textarea>
          
          <div className="modalCreate-buttons">
            <button className="modal-createCancel" onClick={() => setShow(false)}>Cancel</button>
            <button className="modal-createConfirm" onClick={createTool}>Add tool</button>
          </div>

        </div>
      </Modal>

      <div className="tool-web">
        <h1>VUTTR</h1>
        <h3>Very useful tools to remember</h3>
      </div>
      
      <div className="container">
        <div className="search">
          <textarea className="tool-search" onChange={(e) => {setTag(e.target.value)}}/>
          <div className="go-search">
            <GoSearch/>
          </div>
          <input type="checkbox" onChange={() => setTagOnly(!tagOnly)} />
          <p>Search in tags only</p>
          <button className="button-create" onClick={() => setShow(true)}> <GoPlus /> Create tool</button>
          
        </div>
        
        {tools.map((tool: Tool) => {
          return (
            <div className="tool-item">
              <ToolItem key={tool.id} tool={tool}/>
            </div>
          )
        })}

      </div>
    </div>
  )
}

export default Home;