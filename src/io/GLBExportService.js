import * as THREE from 'three';
import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter.js';
import { effectiveState } from '../domain/sceneGraph.js';
import { createObjectView } from '../scene/ObjectViewFactory.js';
import { AppError } from './AppError.js';

export function buildExportScene(objects) {
  const scene = new THREE.Scene();
  scene.name = 'ForgeStudioExport';
  const views = new Map();
  for (const object of objects) {
    if (!effectiveState(objects, object.id).visible) continue;
    const view = createObjectView(object);
    view.userData = {};
    views.set(object.id, view);
  }
  for (const object of objects) {
    const view = views.get(object.id);
    if (!view) continue;
    const parent = object.parentId ? views.get(object.parentId) : scene;
    if (!parent) continue;
    parent.add(view);
  }
  return scene;
}

export class GLBExportService {
  async exportArrayBuffer(objects) {
    if (
      !objects.some(
        (object) => object.type === 'mesh' && effectiveState(objects, object.id).visible,
      )
    ) {
      throw new AppError('EXPORT_EMPTY', '내보낼 visible Mesh가 없습니다.');
    }
    const scene = buildExportScene(objects);
    const exporter = new GLTFExporter();
    return new Promise((resolve, reject) => {
      exporter.parse(
        scene,
        (result) => {
          if (result instanceof ArrayBuffer) resolve(result);
          else reject(new AppError('EXPORT_FAILED', 'Binary GLB를 생성하지 못했습니다.'));
        },
        (cause) =>
          reject(
            new AppError('EXPORT_FAILED', 'GLB 내보내기에 실패했습니다.', cause.message, {
              cause,
            }),
          ),
        {
          binary: true,
          onlyVisible: true,
          includeCustomExtensions: false,
          trs: true,
        },
      );
    });
  }
}

export function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  setTimeout(() => URL.revokeObjectURL(url), 0);
}
