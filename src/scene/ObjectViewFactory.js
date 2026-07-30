import * as THREE from 'three';

export function createGeometry(geometry) {
  const p = geometry.parameters;
  switch (geometry.kind) {
    case 'box':
      return new THREE.BoxGeometry(
        p.width,
        p.height,
        p.depth,
        p.widthSegments,
        p.heightSegments,
        p.depthSegments,
      );
    case 'sphere':
      return new THREE.SphereGeometry(p.radius, p.widthSegments, p.heightSegments);
    case 'cylinder':
      return new THREE.CylinderGeometry(
        p.radiusTop,
        p.radiusBottom,
        p.height,
        p.radialSegments,
        p.heightSegments,
        p.openEnded,
      );
    case 'cone':
      return new THREE.ConeGeometry(
        p.radius,
        p.height,
        p.radialSegments,
        p.heightSegments,
        p.openEnded,
      );
    case 'plane':
      return new THREE.PlaneGeometry(p.width, p.height, p.widthSegments, p.heightSegments);
    case 'torus':
      return new THREE.TorusGeometry(p.radius, p.tube, p.radialSegments, p.tubularSegments, p.arc);
    case 'icosahedron':
      return new THREE.IcosahedronGeometry(p.radius, p.detail);
    default:
      throw new Error(`Unsupported geometry: ${geometry.kind}`);
  }
}

export function createMaterial(material) {
  const side = {
    front: THREE.FrontSide,
    back: THREE.BackSide,
    double: THREE.DoubleSide,
  }[material.side];
  return new THREE.MeshStandardMaterial({
    color: material.color,
    roughness: material.roughness,
    metalness: material.metalness,
    opacity: material.opacity,
    transparent: material.transparent,
    wireframe: material.wireframe,
    flatShading: material.flatShading,
    side,
  });
}

export function applyTransform(view, transform) {
  view.position.fromArray(transform.position);
  view.rotation.set(...transform.rotation.radians, transform.rotation.order);
  view.scale.fromArray(transform.scale);
}

export function createObjectView(object) {
  const view =
    object.type === 'group'
      ? new THREE.Group()
      : new THREE.Mesh(createGeometry(object.geometry), createMaterial(object.material));
  view.name = object.name;
  view.visible = object.visible;
  view.userData.domainId = object.id;
  applyTransform(view, object.transform);
  if (view.isMesh) {
    view.castShadow = true;
    view.receiveShadow = true;
  }
  return view;
}

export function disposeObjectView(view) {
  view.traverse((child) => {
    child.geometry?.dispose?.();
    if (Array.isArray(child.material)) child.material.forEach((material) => material.dispose());
    else child.material?.dispose?.();
  });
}
