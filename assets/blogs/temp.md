# How Objects Work in a Lens Studio Scene

I designed this diagram to make it easier to understand how objects are structured and updated within a Lens Studio scene.

![Scene Hierarchy Diagram](path/to/your/scene_diagram.png)

At the top is the **scene**—the root of the scene graph. Everything in the AR lens exists under this root.  

From there, three key components branch out:

- **Camera**: Handles rendering and provides the user’s viewpoint.  
- **Lights**: Illuminate the scene and give objects depth and realism.  
- **Anchors**: Track positions in the scene, such as a face or world surface.

For face-based AR, anchors often feed into **face landmarks**, which track points on the user’s face like the nose, eyes, and mouth.  

Objects that are attached to these landmarks—**attached objects**—inherit the position, rotation, and scale from their parent. This is how virtual glasses, hats, or other props move naturally with the user’s face.  

Attached objects can include:

- **Glasses mesh** – 3D models that follow face transformations.  
- **Hats / props mesh** – Animated or rigged models for more complex effects.  
- **Face effects** – Materials, textures, and VFX applied directly to the face.  

Finally, the **materials** and **VFX graph** define the visual appearance of these objects, including shaders, textures, blends, and particle systems, creating the polished AR effect the user sees.  

Understanding this hierarchy—**scene → camera/lights/anchors → landmarks → attached objects → materials/VFX**—helps clarify how Lens Studio organizes and updates content frame by frame.


---

# Understanding Script Execution in Lens Studio

I created this diagram to help make sense of how scripts run and interact in Lens Studio. It’s easy to get lost without seeing the sequence visually.

![Script Flow Diagram](path/to/your/script_flow_diagram.png)

Scripts in Lens Studio go through a predictable lifecycle:

1. **Script Load** – The script is initialized and ready to run.  
2. **onAwake()** – Setup default values and initialize variables.  
3. **onStart()** – Scene objects are available and can be referenced or modified.  
4. **onUpdate()** – Runs every frame (~30–60fps) and handles the main logic loop, such as:
   - Animating objects  
   - Applying transforms  
   - Responding to tracking data  
   - Procedural changes  

Scripts also respond to **events**, which can trigger logic outside the main update loop:

- **Touch Events** – Functions like `onTouchStarted()` or `onTouchMoved()` respond to taps, swipes, or gestures.  
- **Custom Events** – Scripts can broadcast and listen for events via `script.api` or `script.broadcastEvent()`.  
- **Timers / Tweens** – Delayed actions and animations trigger callbacks when completed.  

All these event handlers feed into the **game/logic flow**, updating the state of objects and triggering actions. Once the frame is complete, the pipeline returns to `onUpdate()` for the next frame, keeping your AR experience responsive and continuous.  

Understanding this flow—**script load → onAwake → onStart → onUpdate + events → next frame**—is key to structuring scripts efficiently and ensuring smooth, interactive behavior.
