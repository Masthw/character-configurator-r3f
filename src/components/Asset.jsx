import { useGLTF } from "@react-three/drei";
import { useMemo } from "react";
import { useConfiguratorStore } from "../store";
import { useEffect } from "react";

export const Asset = ({ url, categoryName, skeleton }) => {
  const { scene } = useGLTF(url);

  const customization = useConfiguratorStore((state) => state.customization);

  const assetColor = customization[categoryName].color;

  useEffect(() => {
    scene.traverse((child) => {
      if (child.isMesh) {
        if (child.material?.name.includes("Color_")) {
         child.material.color.set(assetColor); 
        }
      }
    });
  }, [assetColor, scene]);

  const attachedItems = useMemo(() => {
    const items = [];
    scene.traverse((child) => {
      if (child.isMesh) {
        items.push({
          geometry: child.geometry,
          material: child.material,
        });
      }
    });
    return items;
  }, [scene]);

  return attachedItems.map((item, index) => (
    <skinnedMesh
      key={index}
      geometry={item.geometry}
      material={item.material}
      skeleton={skeleton}
      castShadow
      receiveShadow
    />
  ));
};
