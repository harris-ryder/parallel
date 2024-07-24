import React, { useState, useContext, useEffect } from 'react'
import { returnArrayOfGeometries, loadPublicGLTFFile } from '../utils/fileLoader'
import { addToScene } from '../script'

const SceneContext = React.createContext()



export function useScene() {
  return useContext(SceneContext)
}

export function SceneProvider({ children }) {


  // STATE
  const [models, setModels] = useState([])


  // CONTEXT VALUES & FUNCTIONS
  const values = { handleFile, loadExampleModel, models }

  // FUNCTIONS
  async function handleFile(e) {
    let newModels = await returnArrayOfGeometries(e)
    setModels((prevModels) => [...newModels, ...prevModels])
  }

  async function loadExampleModel() {
    try {
      let newModels = await loadPublicGLTFFile('2CylinderEngine.gltf');
      setModels((prevModels) => [...newModels, ...prevModels])
    } catch (error) {
      console.error('Error loading GLTF model:', error);
    }
  }

  // USE EFFECT
  useEffect(() => {
    for (const model of models) {
      if (!model.inScene) addToScene(model)
      model.inScene = true

    }

  }, [models])


  return (
    <SceneContext.Provider value={values}>
      {children}
    </SceneContext.Provider>
  )
}
