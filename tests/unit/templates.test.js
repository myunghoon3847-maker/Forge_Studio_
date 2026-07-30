import { describe, expect, it } from 'vitest';
import { worldBoundsForIds } from '../../src/domain/sceneGraph.js';
import { TEMPLATE_DEFINITIONS, TemplateRegistry } from '../../src/templates/TemplateRegistry.js';

function idFactory() {
  let counter = 0;
  return () => {
    counter += 1;
    return `10000000-0000-4000-8000-${String(counter).padStart(12, '0')}`;
  };
}

describe('AT-002 Template fixtures', () => {
  it('registers exactly the 20 required templates', () => {
    const registry = new TemplateRegistry();
    expect(registry.list()).toHaveLength(20);
    expect(registry.list().map((definition) => definition.templateId)).toEqual([
      'nature.oak',
      'nature.pine',
      'nature.bush',
      'nature.rock-small',
      'nature.rock-cluster',
      'building.wood-house',
      'building.watch-tower',
      'building.fence',
      'building.well',
      'prop.crate',
      'prop.barrel',
      'prop.chest',
      'prop.table',
      'prop.chair',
      'prop.campfire',
      'weapon.sword',
      'weapon.axe',
      'weapon.shield',
      'weapon.spear',
      'character.slime',
    ]);
  });

  it.each(TEMPLATE_DEFINITIONS)(
    '$templateId preserves Root/Part metadata, triangle limit, pivot, and Y=0',
    (definition) => {
      const registry = new TemplateRegistry();
      const built = registry.build(definition.templateId, { idFactory: idFactory() });
      const [root, ...parts] = built.objects;
      expect(root.type).toBe('group');
      expect(root.transform.position).toEqual([0, 0, 0]);
      expect(root.editor.templateRole).toBe('root');
      expect(root.editor.templateRootId).toBe(root.id);
      expect(parts).toHaveLength(definition.parts.length);
      expect(parts.every((part) => part.parentId === root.id)).toBe(true);
      expect(parts.every((part) => part.editor.templateRootId === root.id)).toBe(true);
      expect(built.triangleCount).toBeLessThanOrEqual(definition.maxTriangles);
      const bounds = worldBoundsForIds(built.objects, [root.id]);
      expect(Math.abs(bounds.min[1])).toBeLessThanOrEqual(1e-9);
    },
  );

  it('supports adding a registry definition without editor-core changes', () => {
    const extra = {
      ...TEMPLATE_DEFINITIONS[0],
      templateId: 'nature.test-tree',
      name: 'Test Tree',
    };
    const registry = new TemplateRegistry([...TEMPLATE_DEFINITIONS, extra]);
    expect(registry.get('nature.test-tree').name).toBe('Test Tree');
    expect(registry.build('nature.test-tree', { idFactory: idFactory() }).objects.length).toBe(
      extra.parts.length + 1,
    );
  });
});
