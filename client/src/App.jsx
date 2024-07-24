import { useState } from 'react';
import { SceneProvider } from './context/SceneContext';
import { Modal } from './components/Modal';
import { SceneTree } from './components/SceneTree';
import './styles/style.scss'

function App() {
  return (
    <>
      <SceneProvider>
        <Modal />
        <SceneTree />
      </SceneProvider>
    </>
  );
}

export default App;

