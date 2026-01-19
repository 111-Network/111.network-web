import { MAP_CONFIG } from '../map-config';

describe('MAP_CONFIG', () => {
  it('should have initial view state', () => {
    expect(MAP_CONFIG.initialViewState).toBeDefined();
    expect(MAP_CONFIG.initialViewState.latitude).toBe(0);
    expect(MAP_CONFIG.initialViewState.longitude).toBe(0);
    expect(MAP_CONFIG.initialViewState.zoom).toBe(2);
  });

  it('should have zoom limits', () => {
    expect(MAP_CONFIG.minZoom).toBe(1);
    expect(MAP_CONFIG.maxZoom).toBe(18);
  });

  it('should have dark and light styles', () => {
    expect(MAP_CONFIG.styles.dark).toBeTruthy();
    expect(MAP_CONFIG.styles.light).toBeTruthy();
    expect(typeof MAP_CONFIG.styles.dark).toBe('string');
    expect(typeof MAP_CONFIG.styles.light).toBe('string');
  });
});
