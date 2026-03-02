/**
 * Simple event system for dashboard refresh
 */

type DashboardEventListener = () => void;

class DashboardEvents {
  private listeners: DashboardEventListener[] = [];

  subscribe(listener: DashboardEventListener): () => void {
    this.listeners.push(listener);
    
    // Return unsubscribe function
    return () => {
      const index = this.listeners.indexOf(listener);
      if (index > -1) {
        this.listeners.splice(index, 1);
      }
    };
  }

  emit(): void {
    this.listeners.forEach(listener => {
      try {
        listener();
      } catch (error) {
        console.error('Dashboard event listener error:', error);
      }
    });
  }
}

export const dashboardEvents = new DashboardEvents();

/**
 * Trigger dashboard refresh from anywhere in the app
 */
export const refreshDashboard = (): void => {
  dashboardEvents.emit();
};