import React, { useState, useContext, useEffect, useMemo } from 'react'
import { returnArrayOfGeometries, loadPublicGLTFFile } from '../utils/fileLoader'
import { addToScene, returnScene } from '../script'

const SceneContext = React.createContext()


export function useScene() {
  return useContext(SceneContext)
}

export function SceneProvider({ children }) {


  const [models, setModels] = useState([])
  const [scene, setScene] = useState([])
  const [selectedNode, setSelectedNode] = useState(null)


  const sceneCopy = useMemo(() => {
    return { ...scene };
  }, [scene])

  const values = { handleFile, loadExampleModel, models, setModels, sceneCopy, setScene, selectedNode, setSelectedNode }

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

  function returnShallowModel() {
    return [...models]
  }

  useEffect(() => {

    for (const model of models) {
      console.log("checking at ui", model)
      if (!model.inScene) addToScene(model)
      model.inScene = true

    }

    if (models.length > 0) setScene(returnScene())

  }, [models])


  useEffect(() => {
    console.log("new scene: ", scene)
  }, [scene])


  return (
    <SceneContext.Provider value={values}>
      {children}
    </SceneContext.Provider>
  )
}
