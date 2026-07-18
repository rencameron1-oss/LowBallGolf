# @bands/ui

Shared Astro and TinaCMS component library bundled inside this template.

This package is intentionally local. Keeping it in `./packages/ui` means a novice user can clone one GitHub repository, run one install command, and get the same reusable block palette without publishing or linking a private package.

## Consuming

The site declares this package as a local `file:` dependency in `package.json`:

```json
"dependencies": {
  "@bands/ui": "file:./packages/ui"
}
```

Components are imported via subpath:

```astro
---
import HomeHeroSlider from "@bands/ui/components/home/HomeHeroSlider.astro";
---
```

Tina block templates:

```ts
import { heroSliderBlock, articleGridBlock } from "@bands/ui/tina";
```

## Template Rule

Keep this package bundled unless you are deliberately turning the starter into a multi-repository design system.
