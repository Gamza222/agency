# Performance Monitoring Guide for HomePage Animations

## Monitoring Re-renders in React DevTools

### Setup

1. Install React DevTools browser extension
2. Open DevTools → React DevTools tab
3. Select "⚛️ Profiler" tab
4. Click the record button (circle) to start profiling
5. Scroll the page and interact with animations
6. Stop recording

### What to Look For

- **Components re-rendering during scroll**: HomePage, LoadingScreen should NOT re-render on every scroll event
- **Re-render frequency**: Should see re-renders only every ~100ms (throttled state updates)
- **Re-render causes**: Check "Why did this render?" - should show state/prop changes, not parent re-renders

## Monitoring Performance in Browser DevTools

### Chrome/Edge Performance Tab

1. Open DevTools → Performance tab
2. Click record (circle icon)
3. Scroll the page for 3-5 seconds
4. Stop recording
5. Look for:
   - **Long tasks** (red blocks) - should be < 50ms
   - **Frame rate** - should be consistently 60fps (green bars)
   - **Layout shifts** (purple) - should be minimal
   - **Scripting time** - should be < 16ms per frame

### Safari Web Inspector Performance

1. Open Web Inspector → Timelines tab
2. Click record
3. Scroll the page
4. Check:
   - **FPS** should stay at 60
   - **Scripting** bars should be thin (< 16ms)
   - No red warning indicators

## Console Logging for Debugging

### Check Re-render Frequency

Add temporary logging to HomePage component:

```typescript
useEffect(() => {
  console.log("HomePage rendered", { animationsComplete, scrollProgress });
});
```

Expected: Should log every ~100ms during scroll (throttled state updates), not every frame.

### Check Transform Update Frequency

Transform updates happen every frame (~16ms) via RAF, but React state updates are throttled to 100ms.

## Key Performance Indicators

### ✅ Good Performance

- 60fps during scroll
- Transform values update smoothly (no jumps)
- React components re-render max once per 100ms
- No layout thrashing (no purple Layout bars in Performance tab)
- RAF callbacks execute in < 16ms

### ❌ Performance Issues

- Frame rate drops below 60fps
- Stuttering/jumping animations
- Components re-rendering on every scroll event
- Long tasks (> 50ms) during scroll
- Layout recalculations during scroll

## Transform Property Decision

**Using `translate3d(x, y, 0)` instead of `translate(x, y)`:**

- `translate3d` with z=0 explicitly forces GPU acceleration in Safari
- Creates compositing layer, offloading work to GPU
- Better performance on Safari, especially with multiple transformed elements
- Slight memory overhead (compositing layer) but worth it for smooth animations





