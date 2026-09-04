import { nanoid } from 'nanoid';

export interface DraftMetadata {
  draftId: string;
  toolId: string;
  projectId?: string;
  projectName?: string;
  createdAt: Date;
  updatedAt: Date;
  schemaVersion: string;
}

export interface DraftData {
  metadata: DraftMetadata;
  projectContext?: any;
  content: any;
}

export interface ProjectContext {
  projectId: string;
  projectName: string;
  clientName?: string;
  projectManager?: string;
  frameworkId?: string;
  startDate?: Date;
  description?: string;
}

const STORAGE_PREFIX = 'pmo_draft_';
const SCHEMA_VERSION = '1.0';
const MAX_DRAFT_AGE_DAYS = 30;

export class DraftStorageService {
  
  saveDraft(toolId: string, content: any, projectContext?: ProjectContext): string {
    const draftId = nanoid();
    const now = new Date();
    
    const draftData: DraftData = {
      metadata: {
        draftId,
        toolId,
        projectId: projectContext?.projectId,
        projectName: projectContext?.projectName,
        createdAt: now,
        updatedAt: now,
        schemaVersion: SCHEMA_VERSION
      },
      projectContext,
      content
    };
    
    try {
      const key = `${STORAGE_PREFIX}${draftId}`;
      localStorage.setItem(key, JSON.stringify(draftData));
      
      // Clean up old drafts
      this.cleanupExpiredDrafts();
      
      return draftId;
    } catch (error) {
      console.error('Failed to save draft:', error);
      throw new Error('No se pudo guardar el borrador. Verifique el espacio disponible.');
    }
  }

  updateDraft(draftId: string, content: any, projectContext?: ProjectContext): boolean {
    try {
      const key = `${STORAGE_PREFIX}${draftId}`;
      const existing = localStorage.getItem(key);
      
      if (!existing) return false;
      
      const draftData: DraftData = JSON.parse(existing);
      draftData.content = content;
      draftData.metadata.updatedAt = new Date();
      
      if (projectContext) {
        draftData.projectContext = projectContext;
        draftData.metadata.projectId = projectContext.projectId;
        draftData.metadata.projectName = projectContext.projectName;
      }
      
      localStorage.setItem(key, JSON.stringify(draftData));
      return true;
    } catch (error) {
      console.error('Failed to update draft:', error);
      return false;
    }
  }

  loadDraft(draftId: string): DraftData | null {
    try {
      const key = `${STORAGE_PREFIX}${draftId}`;
      const stored = localStorage.getItem(key);
      
      if (!stored) return null;
      
      const draftData: DraftData = JSON.parse(stored);
      
      // Convert date strings back to Date objects
      draftData.metadata.createdAt = new Date(draftData.metadata.createdAt);
      draftData.metadata.updatedAt = new Date(draftData.metadata.updatedAt);
      
      return draftData;
    } catch (error) {
      console.error('Failed to load draft:', error);
      return null;
    }
  }

  listDrafts(toolId?: string): DraftMetadata[] {
    const drafts: DraftMetadata[] = [];
    
    try {
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (!key?.startsWith(STORAGE_PREFIX)) continue;
        
        const stored = localStorage.getItem(key);
        if (!stored) continue;
        
        const draftData: DraftData = JSON.parse(stored);
        
        // Filter by toolId if provided
        if (toolId && draftData.metadata.toolId !== toolId) continue;
        
        // Convert dates
        draftData.metadata.createdAt = new Date(draftData.metadata.createdAt);
        draftData.metadata.updatedAt = new Date(draftData.metadata.updatedAt);
        
        drafts.push(draftData.metadata);
      }
    } catch (error) {
      console.error('Failed to list drafts:', error);
    }
    
    // Sort by updatedAt descending
    return drafts.sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());
  }

  deleteDraft(draftId: string): boolean {
    try {
      const key = `${STORAGE_PREFIX}${draftId}`;
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error('Failed to delete draft:', error);
      return false;
    }
  }

  clearAllDrafts(): boolean {
    try {
      const keysToRemove: string[] = [];
      
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key?.startsWith(STORAGE_PREFIX)) {
          keysToRemove.push(key);
        }
      }
      
      keysToRemove.forEach(key => localStorage.removeItem(key));
      return true;
    } catch (error) {
      console.error('Failed to clear drafts:', error);
      return false;
    }
  }

  cleanupExpiredDrafts(): void {
    try {
      const now = new Date();
      const keysToRemove: string[] = [];
      
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (!key?.startsWith(STORAGE_PREFIX)) continue;
        
        const stored = localStorage.getItem(key);
        if (!stored) continue;
        
        const draftData: DraftData = JSON.parse(stored);
        const updatedAt = new Date(draftData.metadata.updatedAt);
        const daysDiff = (now.getTime() - updatedAt.getTime()) / (1000 * 60 * 60 * 24);
        
        if (daysDiff > MAX_DRAFT_AGE_DAYS) {
          keysToRemove.push(key);
        }
      }
      
      keysToRemove.forEach(key => localStorage.removeItem(key));
      
      if (keysToRemove.length > 0) {
        console.log(`Cleaned up ${keysToRemove.length} expired drafts`);
      }
    } catch (error) {
      console.error('Failed to cleanup expired drafts:', error);
    }
  }

  getStorageInfo() {
    const draftsCount = this.listDrafts().length;
    let totalSize = 0;
    
    try {
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key?.startsWith(STORAGE_PREFIX)) {
          const value = localStorage.getItem(key);
          if (value) {
            totalSize += new Blob([value]).size;
          }
        }
      }
    } catch (error) {
      console.error('Failed to calculate storage info:', error);
    }
    
    return {
      draftsCount,
      totalSizeBytes: totalSize,
      totalSizeKB: Math.round(totalSize / 1024)
    };
  }
}

export const draftStorageService = new DraftStorageService();