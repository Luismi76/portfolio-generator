// SkillTableForm.tsx - CORREGIDO PARA USAR portfolio-types.ts
import React, { useState, useEffect } from "react";
import { Skill, SkillTableFormProps } from "../types/portfolio-types";
import { Icons } from "./portfolio-icons";
import { Section } from "./Section";


interface SkillModalProps {
  skill?: Skill;
  index?: number;
  isOpen: boolean;
  onClose: () => void;
  onSave: (index: number | undefined, skillData: Skill) => void;
}

// Modal para crear/editar habilidades
const SkillModal: React.FC<SkillModalProps> = ({
  skill,
  index,
  isOpen,
  onClose,
  onSave,
}) => {
  const [formData, setFormData] = useState<Skill>({
    category: "",
    items: "",
    level: "",
  });

  // Sincronizar formData cuando cambia skill o isOpen
  useEffect(() => {
    if (isOpen && skill) {
      setFormData({
        category: skill.category || "",
        items: skill.items || "",
        level: skill.level || "",
      });
    } else if (isOpen && !skill) {
      setFormData({
        category: "",
        items: "",
        level: "",
      });
    }
  }, [skill, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.category.trim() || !formData.items.trim()) {
      alert("La categoría y las habilidades son obligatorias");
      return;
    }

    onSave(index, formData);
    onClose();
  };

  // ... resto del código sin cambios

  const updateField = (field: keyof Skill, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // Obtener lista de habilidades para preview
  const skillsList = formData.items
    .split(",")
    .map((item) => item.trim())
    .filter((item) => item.length > 0);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <form onSubmit={handleSubmit}>
          {/* Header del modal */}
          <div className="flex items-center justify-between p-6 border-b">
            <h2 className="text-xl font-semibold">
              {index !== undefined ? "Editar Categoría" : "Nueva Categoría"}
            </h2>
            <button
              type="button"
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <Icons.X size={24} />
            </button>
          </div>

          <div className="p-6 space-y-6">
            {/* Nombre de categoría */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nombre de la categoría *
              </label>
              <input
                type="text"
                value={formData.category}
                onChange={(e) => updateField("category", e.target.value)}
                placeholder="Ej: Frontend, Backend, Herramientas, Soft Skills"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            {/* Habilidades */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Habilidades *
              </label>
              <textarea
                value={formData.items}
                onChange={(e) => updateField("items", e.target.value)}
                placeholder="React, JavaScript, TypeScript, Node.js, Express"
                rows={4}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
              <div className="text-xs text-gray-500 mt-1">
                Separa cada habilidad con una coma. Serán mostradas como
                etiquetas individuales.
              </div>
            </div>

            {/* Nivel de experiencia */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nivel de experiencia
              </label>
              <select
                value={formData.level || ""}
                onChange={(e) => updateField("level", e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Seleccionar nivel</option>
                <option value="Principiante">Principiante</option>
                <option value="Intermedio">Intermedio</option>
                <option value="Avanzado">Avanzado</option>
                <option value="Experto">Experto</option>
              </select>
            </div>

            {/* Preview de habilidades */}
            {skillsList.length > 0 && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Vista previa ({skillsList.length} habilidades):
                </label>
                <div className="flex flex-wrap gap-2 p-3 bg-gray-50 rounded-lg border">
                  {skillsList.map((skill, skillIndex) => (
                    <span
                      key={skillIndex}
                      className="inline-flex items-center px-2.5 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 border"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Consejos */}
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
              <div className="flex items-start gap-2">
                <Icons.Info
                  size={16}
                  className="text-amber-600 mt-0.5 flex-shrink-0"
                />
                <div className="text-sm text-amber-800">
                  <strong>Consejos:</strong>
                  <ul className="mt-1 space-y-1 list-disc list-inside">
                    <li>Usa nombres reconocidos de tecnologías</li>
                    <li>Ordena por nivel de dominio (más fuerte primero)</li>
                    <li>
                      Incluye versiones específicas si es relevante (React 18,
                      Node.js 20)
                    </li>
                    <li>
                      Combina habilidades técnicas y blandas según la categoría
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Footer del modal */}
          <div className="flex justify-end gap-3 p-6 border-t bg-gray-50">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              {index !== undefined ? "Actualizar" : "Crear"} Categoría
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Componente principal de tabla de habilidades
export const SkillTableForm: React.FC<SkillTableFormProps> = ({
  skills,
  onUpdate,
  onAdd,
  onRemove,
}) => {
  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    skill?: Skill;
    index?: number;
  }>({ isOpen: false });

  const handleCreateNew = () => {
    onAdd();
    const newIndex = skills.length;
    setModalState({
      isOpen: true,
      index: newIndex,
      skill: skills[newIndex],
    });
  };

  const handleEdit = (index: number) => {
    const skillToEdit = skills[index];
    setModalState({
      isOpen: true,
      skill: { ...skillToEdit }, // Clonar el objeto para evitar mutaciones
      index,
    });
  };

  const handleSave = (index: number | undefined, skillData: Skill) => {
    if (index !== undefined) {
      onUpdate(index, "category", skillData.category);
      onUpdate(index, "items", skillData.items); // ✅ Usar 'items'
      if (skillData.level) {
        onUpdate(index, "level", skillData.level);
      }
    }
  };

  const closeModal = () => {
    setModalState({ isOpen: false });
  };

  // Función para obtener color de badge basado en índice
  const getBadgeColor = (index: number) => {
    const colors = [
      "bg-blue-100 text-blue-800",
      "bg-green-100 text-green-800",
      "bg-purple-100 text-purple-800",
      "bg-yellow-100 text-yellow-800",
      "bg-pink-100 text-pink-800",
      "bg-indigo-100 text-indigo-800",
    ];
    return colors[index % colors.length];
  };

  return (
    <>
      <Section
        title="Habilidades"
        description="Organiza tus competencias por categorías"
        icon={Icons.Award}
        showAddButton={true}
        onAdd={handleCreateNew}
        addButtonText="Nueva Categoría"
      >
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-200 rounded-lg">
            <thead>
              <tr className="bg-gray-50">
                <th className="border border-gray-200 p-3 text-left font-medium text-gray-700">
                  Categoría
                </th>
                <th className="border border-gray-200 p-3 text-left font-medium text-gray-700">
                  Habilidades
                </th>
                <th className="border border-gray-200 p-3 text-center font-medium text-gray-700 w-20">
                  Total
                </th>
                <th className="border border-gray-200 p-3 text-center font-medium text-gray-700 w-24">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody>
              {skills.length === 0 ? (
                <tr>
                  <td
                    colSpan={4}
                    className="border border-gray-200 p-8 text-center text-gray-500"
                  >
                    <Icons.Award
                      size={32}
                      className="mx-auto mb-2 text-gray-300"
                    />
                    <p>No hay categorías de habilidades aún</p>
                    <button
                      onClick={handleCreateNew}
                      className="mt-2 text-blue-600 hover:text-blue-800"
                    >
                      Crear tu primera categoría
                    </button>
                  </td>
                </tr>
              ) : (
                skills.map((skill, index) => {
                  // ✅ CORRECTO: Usar 'items' en lugar de 'items'
                  const skillsList = skill.items
                    ? skill.items
                        .split(",")
                        .map((s) => s.trim())
                        .filter((s) => s.length > 0)
                    : [];

                  const maxVisible = 4;
                  const visibleSkills = skillsList.slice(0, maxVisible);
                  const remainingCount = skillsList.length - maxVisible;

                  return (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="border border-gray-200 p-3">
                        <div className="flex items-center gap-2">
                          <Icons.Award
                            size={16}
                            className="text-blue-600 flex-shrink-0"
                          />
                          <div>
                            <span className="font-medium text-gray-900">
                              {skill.category || "Sin categoría"}
                            </span>
                            {skill.level && (
                              <div className="text-xs text-gray-500 mt-1">
                                Nivel: {skill.level}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="border border-gray-200 p-3">
                        <div className="flex flex-wrap gap-1">
                          {visibleSkills.length > 0 ? (
                            <>
                              {visibleSkills.map((skillItem, skillIndex) => (
                                <span
                                  key={skillIndex}
                                  className={`px-2 py-1 text-xs rounded font-medium ${getBadgeColor(
                                    skillIndex
                                  )}`}
                                >
                                  {skillItem}
                                </span>
                              ))}
                              {remainingCount > 0 && (
                                <span className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded font-medium">
                                  +{remainingCount} más
                                </span>
                              )}
                            </>
                          ) : (
                            <span className="text-gray-400 text-sm">
                              Sin habilidades
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="border border-gray-200 p-3 text-center">
                        <span className="inline-flex items-center justify-center w-6 h-6 text-xs font-bold text-white bg-blue-600 rounded-full">
                          {skillsList.length}
                        </span>
                      </td>
                      <td className="border border-gray-200 p-3">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => handleEdit(index)}
                            className="p-1 text-blue-600 hover:text-blue-800"
                            title="Editar categoría"
                          >
                            <Icons.Settings size={16} />
                          </button>
                          {skills.length > 1 && (
                            <button
                              onClick={() => {
                                if (
                                  window.confirm(
                                    "¿Eliminar esta categoría de habilidades?"
                                  )
                                ) {
                                  onRemove(index);
                                }
                              }}
                              className="p-1 text-red-600 hover:text-red-800"
                              title="Eliminar categoría"
                            >
                              <Icons.Trash2 size={16} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {skills.length > 0 && (
          <div className="mt-4 text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
            <div className="flex items-center justify-between">
              <span>
                Total: {skills.length} categorías,{" "}
                {skills.reduce((total, skill) => {
                  // ✅ CORRECTO: Usar 'items' en lugar de 'items'
                  const count = skill.items
                    ? skill.items.split(",").filter((s) => s.trim()).length
                    : 0;
                  return total + count;
                }, 0)}{" "}
                habilidades
              </span>
              <div className="flex items-center gap-1 text-xs">
                <Icons.Info size={12} />
                <span>Máximo 4 habilidades visibles por fila</span>
              </div>
            </div>
          </div>
        )}
      </Section>

      <SkillModal
        skill={modalState.skill}
        index={modalState.index}
        isOpen={modalState.isOpen}
        onClose={closeModal}
        onSave={handleSave}
      />
    </>
  );
};

export default SkillTableForm;
