import { useRef } from "react";
import { useAnimations, useFBX, useGLTF } from "@react-three/drei";
import { useConfiguratorStore } from "../store";
import { Suspense } from "react";
import { Asset } from "./Asset";
import { pb } from "../store";
import { useEffect } from "react";

export const Avatar = ({ ...props }) => {
  const group = useRef();
  const { nodes } = useGLTF("models/Armature.glb");
  const { animations } = useFBX("models/Idle.fbx");
  const customization = useConfiguratorStore((state) => state.customization);

  const { actions } = useAnimations(animations, group);

  useEffect(() => {
    actions["mixamo.com"]?.play();
  }, [actions]);

  return (
    <group ref={group} {...props} dispose={null}>
      <group name="Scene">
        <group name="Armature" rotation={[Math.PI / 2, 0, 0]} scale={0.01}>
          <primitive object={nodes.mixamorigHips} />
          {Object.keys(customization).map(
            (key) =>
              customization[key]?.asset?.url && (
                <Suspense key={customization[key].asset.id}>
                  <Asset
                    url={pb.files.getURL(
                      customization[key].asset,
                      customization[key].asset.url
                    )}
                    skeleton={nodes.Plane.skeleton}
                  />
                </Suspense>
              )
          )}
        </group>
      </group>
    </group>
  );
};

useGLTF.preload("/Armature.glb");
