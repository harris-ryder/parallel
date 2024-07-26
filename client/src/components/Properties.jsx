import React, { useState, useEffect, useMemo } from 'react'
import { useScene } from '../context/SceneContext';
import { MeshStandardMaterial } from 'three';
import * as THREE from 'three';

export function Properties() {


  const { selectedNode } = useScene();
  const [color, setColor] = useState('#7b1288');
  useEffect(() => {
    if (selectedNode) selectedNode.material = new THREE.MeshStandardMaterial({ color: color });
  }, [color])

  const nodePos = useMemo(() => {
    if (selectedNode) {
      console.log("in memeo: ", selectedNode)

      function cleanNumber(num) {
        let roundedNum = Math.round(num * 10) / 10
        if (roundedNum.toString().length > 4) return Math.floor(roundedNum)
        return roundedNum
      }

      return {
        x: cleanNumber(selectedNode.position.x),
        y: cleanNumber(selectedNode.position.y),
        z: cleanNumber(selectedNode.position.z),
      };
    }
    return { x: 0, y: 0, z: 0 };
  }, [selectedNode]);


  return (
    <>
      <h3 className='panel-header properties-header'>Properties</h3>

      <div className='properties' >

        <div className='color-selector'>
          <select className='color-dropdown'>
            <option>MeshStandardMaterial</option>
          </select>
          <input type="color" value={color} id="color-picker" onChange={e => setColor(e.target.value)} />
        </div>

        <div className='position-selector'>
          <p>Position</p>
          <div className='pos-val pos-x'><p>x:</p><p>{nodePos.x}</p></div>
          <div className='pos-val pos-y'><p>y:</p><p>{nodePos.y}</p></div>
          <div className='pos-val pos-z'><p>z:</p><p>{nodePos.z}</p></div>

        </div>

        <div className='scale-selector'>
          <p>Scale</p>
          <input type="range" min="0" max="100" className="scale-slider" value="57" />
          <div className='pos-val scale-val'><p>2</p></div>
        </div>

      </div>
    </>

  )
}

