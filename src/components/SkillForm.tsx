// SkillForm.tsx
import React from 'react';
import { Skill } from '../types/portfolio-types';
import { Icons } from './portfolio-icons';
import { Section } from './Section';

interface SkillFormProps {
  skills: Skill[];
  onUpdate: (index: number, field: keyof Skill, value: string) => void;
  onAdd: () => void;
  onRemove: (index: number) => void;
}

interface EditableSkillItemProps {
  skill: Skill;
  index: number;
  onUpdate: (index: number, field: keyof Skill, value: string) => void;
  onRemove?: (index: number) => void;
  showRemoveButton: boolean;
}

// Componente individual para cada habilidad
const EditableSkillItem: React.FC<EditableSkillItemProps> = ({
  skill,
  index,
  onUpdate,
  onRemove,
  showRemoveButton
}) => {
  return (
    <div className="border border-gray-200 rounded-lg p-4">
      <div className="flex justify-between items-start mb-3">
        <h4 className="font-medium text-gray-700">
          Categoría {index + 1}
        </h4>
        {showRemoveButton && onRemove && (
          <button
            onClick={() => onRemove(index)}
            className="text-red-500 hover:text-red-700 transition-colors p-1"
            title="Eliminar categoría"
          >
            <Icons.Trash2 size={16} />
          </button>
        )}
      </div>

      <div className="space-y-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nombre de la categoría
          </label>
          <input
            type="text"
            placeholder="Ej: Frontend, Backend, Herramientas, Soft Skills"
            value={skill.category}
            onChange={(e) => onUpdate(index, "category", e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Habilidades
          </label>
          <input
            type="text"
            placeholder="React, JavaScript, TypeScript, Node.js (separadas por comas)"
            value={skill.items}
            onChange={(e) => onUpdate(index, "items", e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
          />
          <div className="text-xs text-gray-500 mt-1">
            Separa cada habilidad con una coma. Ejemplo: React, Vue, Angular
          </div>
        </div>

        {/* Preview de habilidades */}
        {skill.items.trim() && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Vista previa:
            </label>
            <div className="flex flex-wrap gap-2">
              {skill.items
                .split(',')
                .filter(item => item.trim())
                .map((item, itemIndex) => (
                  <span
                    key={itemIndex}
                    className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                  >
                    {item.trim()}
                  </span>
                ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Componente principal del formulario de habilidades
export const SkillForm: React.FC<SkillFormProps> = ({
  skills,
  onUpdate,
  onAdd,
  onRemove,
}) => {
  return (
    <Section
      title="Habilidades"
      description="Organiza tus competencias técnicas y profesionales por categorías"
      icon={Icons.Award}
      showAddButton={true}
      onAdd={onAdd}
      addButtonText="Nueva Categoría"
    >
      <div className="space-y-4">
        {skills.map((skill, index) => (
          <EditableSkillItem
            key={index}
            skill={skill}
            index={index}
            onUpdate={onUpdate}
            onRemove={skills.length > 1 ? onRemove : undefined}
            showRemoveButton={skills.length > 1}
          />
        ))}

        {/* Mensaje si no hay habilidades */}
        {skills.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <Icons.Award size={48} className="mx-auto text-gray-300 mb-4" />
            <p>No hay categorías de habilidades aún.</p>
            <p className="text-sm">Haz clic en "Nueva Categoría" para empezar.</p>
          </div>
        )}

        {/* Ayuda contextual */}
        <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
          <div className="flex items-start gap-2">
            <Icons.Info size={16} className="text-amber-600 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-amber-800">
              <strong>Consejos:</strong>
              <ul className="mt-1 space-y-1 list-disc list-inside">
                <li>Organiza por categorías como "Frontend", "Backend", "Herramientas"</li>
                <li>Incluye tanto habilidades técnicas como blandas</li>
                <li>Usa nombres conocidos de tecnologías para mejor reconocimiento</li>
                <li>Ordena por nivel de competencia (las más fuertes primero)</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
};

export default SkillForm;