import { create } from "zustand";
import type {
  Project,
  ProjectTask,
  CreateProjectRequest,
  UpdateProjectRequest,
  AssignTaskRequest,
  ProjectStatus,
} from "@/types";
import {
  getProjects as apiGetProjects,
  createProject as apiCreateProject,
  updateProject as apiUpdateProject,
  deleteProject as apiDeleteProject,
  assignTaskToProject as apiAssignTask,
  unassignTaskFromProject as apiUnassignTask,
  getProjectTasks as apiGetProjectTasks,
} from "@/lib/api/projects";

interface ProjectState {
  // State
  projects: Project[];
  selectedProject: Project | null;
  projectTasks: ProjectTask[];
  isLoading: boolean;
  error: string | null;

  // Filters
  statusFilter: ProjectStatus | null;
  techStackFilter: string[];

  // Actions
  fetchProjects: () => Promise<void>;
  fetchProjectsWithFilters: (status?: ProjectStatus, techStackIds?: string[]) => Promise<void>;
  selectProject: (project: Project | null) => void;
  createProject: (projectData: CreateProjectRequest) => Promise<Project>;
  updateProject: (projectId: string, projectData: UpdateProjectRequest) => Promise<Project>;
  deleteProject: (projectId: string) => Promise<void>;
  assignTask: (projectId: string, taskData: AssignTaskRequest) => Promise<void>;
  unassignTask: (projectId: string, taskId: string) => Promise<void>;
  fetchProjectTasks: (projectId: string) => Promise<void>;
  setStatusFilter: (status: ProjectStatus | null) => void;
  setTechStackFilter: (techStackIds: string[]) => void;
  clearFilters: () => void;
}

export const useProjectStore = create<ProjectState>((set, get) => ({
  // Initial state
  projects: [],
  selectedProject: null,
  projectTasks: [],
  isLoading: false,
  error: null,
  statusFilter: null,
  techStackFilter: [],

  // Fetch all projects (no filters)
  fetchProjects: async () => {
    set({ isLoading: true, error: null });
    try {
      const { projects } = await apiGetProjects();
      set({ projects, isLoading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "Failed to fetch projects",
        isLoading: false,
      });
    }
  },

  // Fetch projects with filters
  fetchProjectsWithFilters: async (status?, techStackIds?) => {
    set({ isLoading: true, error: null });
    try {
      const { projects } = await apiGetProjects(status, techStackIds);
      set({ projects, isLoading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "Failed to fetch projects",
        isLoading: false,
      });
    }
  },

  // Select a project for detail view
  selectProject: (project) => {
    set({ selectedProject: project });
  },

  // Create new project
  createProject: async (projectData) => {
    set({ isLoading: true, error: null });
    try {
      const { project: newProject } = await apiCreateProject(projectData);
      set((state) => ({
        projects: [newProject, ...state.projects],
        selectedProject: newProject,
        isLoading: false,
      }));
      return newProject;
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "Failed to create project",
        isLoading: false,
      });
      throw error;
    }
  },

  // Update project
  updateProject: async (projectId, projectData) => {
    set({ isLoading: true, error: null });
    try {
      const { project: updatedProject } = await apiUpdateProject(projectId, projectData);
      set((state) => ({
        projects: state.projects.map((p) =>
          p.id === projectId ? updatedProject : p
        ),
        selectedProject:
          state.selectedProject?.id === projectId
            ? updatedProject
            : state.selectedProject,
        isLoading: false,
      }));
      return updatedProject;
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "Failed to update project",
        isLoading: false,
      });
      throw error;
    }
  },

  // Delete project
  deleteProject: async (projectId) => {
    set({ isLoading: true, error: null });
    try {
      await apiDeleteProject(projectId);
      set((state) => ({
        projects: state.projects.filter((p) => p.id !== projectId),
        selectedProject:
          state.selectedProject?.id === projectId ? null : state.selectedProject,
        isLoading: false,
      }));
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "Failed to delete project",
        isLoading: false,
      });
      throw error;
    }
  },

  // Assign task to project
  assignTask: async (projectId, taskData) => {
    set({ isLoading: true, error: null });
    try {
      await apiAssignTask(projectId, taskData);
      // Refresh project tasks
      await get().fetchProjectTasks(projectId);
      set({ isLoading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "Failed to assign task",
        isLoading: false,
      });
      throw error;
    }
  },

  // Unassign task from project
  unassignTask: async (projectId, taskId) => {
    set({ isLoading: true, error: null });
    try {
      await apiUnassignTask(projectId, taskId);
      // Refresh project tasks
      await get().fetchProjectTasks(projectId);
      set({ isLoading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "Failed to unassign task",
        isLoading: false,
      });
      throw error;
    }
  },

  // Fetch tasks assigned to a project
  fetchProjectTasks: async (projectId) => {
    set({ isLoading: true, error: null });
    try {
      const { tasks } = await apiGetProjectTasks(projectId);
      set({ projectTasks: tasks, isLoading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "Failed to fetch project tasks",
        isLoading: false,
      });
    }
  },

  // Set status filter
  setStatusFilter: (status) => {
    set({ statusFilter: status });
    const { techStackFilter } = get();
    get().fetchProjectsWithFilters(
      status || undefined,
      techStackFilter.length > 0 ? techStackFilter : undefined
    );
  },

  // Set tech stack filter
  setTechStackFilter: (techStackIds) => {
    set({ techStackFilter: techStackIds });
    const { statusFilter } = get();
    get().fetchProjectsWithFilters(
      statusFilter || undefined,
      techStackIds.length > 0 ? techStackIds : undefined
    );
  },

  // Clear all filters
  clearFilters: () => {
    set({ statusFilter: null, techStackFilter: [] });
    get().fetchProjectsWithFilters(undefined, undefined);
  },
}));