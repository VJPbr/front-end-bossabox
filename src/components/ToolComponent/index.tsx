import React, { useState } from 'react';
import Modal from 'react-modal';

import { GoTrashcan } from 'react-icons/go'

import api from '../../server/api'

export interface Tool {
  id: number,
  title: string,
  link: string,
  description: string,
  tags: string,
};

interface ToolsItemProps {
  tool: Tool;
}

const ToolItem: React.FC<ToolsItemProps> = ({ tool }) => {

  const [title, setTitle] = useState('');
  const [showDelete, setShowDelete] = useState(false);
  const [idToDelete, setIdToDelete] = useState(Number);

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

  async function deleteTool(id: Number) {
    await api.delete(`/tools/${id}`);
  }

  return (
    <div className="tool-item">

      <Modal
        isOpen={showDelete}
        style={customStyles}
        onRequestClose={() => setShowDelete(false)}
      >
        <div className="modal-delete">
          <h2>Remove tool</h2>
          <p>Are you sure you want to remove the tool: {title} ?</p>
          <div className="modalDelete-buttons">
            <button className="modal-deleteCancel" onClick={() => setShowDelete(false)}>Cancel</button>
            <button className="modal-deleteTool" onClick={() => deleteTool(idToDelete) && setShowDelete(false)}>Delete tool</button>
          </div>
        
        </div>
      </Modal>

      <button onClick={() => {
        setShowDelete(true)
        setIdToDelete(tool.id)
        setTitle(tool.title)
      }}
      >
        <GoTrashcan/>Delete tool
      </button>
      
      <a href={tool.link}>{tool.title}</a>
      <p>{tool.description}</p>
      <p>Tags: {tool.tags}</p>
    </div>
  );
};

export default ToolItem;