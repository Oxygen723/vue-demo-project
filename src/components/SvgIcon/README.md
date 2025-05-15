#### SvgIcon SVG 图标组件

用于显示 SVG 格式的图标。

使用该组件来显示的 svg 需要放在文件夹`src/assets/images/icon`

且修改 svg 的 fill 为`currentColor`然后设置 css 样式 color 即可

**属性:**

- `name` - 图标名称
- `size` - 图标大小（可选）
- `prefix` - 图标前缀（默认：'icon'）
- `color` - 图标颜色（默认：'#333'）
- `width` - 图标宽度（默认：'16px'）
- `height` - 图标高度（默认：'16px'）
- `className` - 额外的 CSS 类名（可选）

**使用示例:**

```vue
<svg-icon name="setting" />
```
