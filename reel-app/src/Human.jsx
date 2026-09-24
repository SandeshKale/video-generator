import Short from './humaaans/head/Short.jsx';
import PointingUp from './humaaans/torso/PointingUp.jsx';
import SkinnyJeans from './humaaans/bottom/SkinnyJeans.jsx';

/**
 * Manual re-composition of humaaans' <Human> (see src/human/human.js in the
 * upstream repo). The upstream component builds Head/Torso/Bottom via
 * react-loadable + a template-literal dynamic import() path, which Vite's
 * bundler can't statically analyze. Body parts are themselves plain,
 * side-effect-free SVG group components, so composing them directly (fixed
 * head/torso/bottom for this POC, standing posture) reproduces the same
 * output with a static import Vite can bundle normally.
 */
export default function Human({ size = 380 }) {
  const height = size * (480 / 380);
  return (
    <svg width={size} height={height} viewBox="0 0 380 480" xmlns="http://www.w3.org/2000/svg">
      <g id="humaaans" fillRule="evenodd" strokeWidth="1">
        <g id="a-standing-human" transform="translate(40.000000, 31.000000)">
          <g id="HEAD" transform="translate(82.000000, 0.000000)">
            <Short />
          </g>
          <g id="BOTTOM" transform="translate(0.000000, 187.000000)">
            <SkinnyJeans />
          </g>
          <g id="TORSO" transform="translate(22.000000, 82.000000)">
            <PointingUp />
          </g>
        </g>
      </g>
    </svg>
  );
}
