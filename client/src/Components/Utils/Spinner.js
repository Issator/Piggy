/**
 * 
 * @export
 * @param {Object} props
 * @param {import("react").CSSProperties} props.style
 * @param {import("react").HTMLAttributes<HTMLDivElement>.className} props.className
 * @param {("primary"|"secondary"|"secondary-dark"|"success"|"warning"|"danger"|"light"|"dark")} props.color
 */
export default function Spinner({style, color, className}){
    const spinnerColor = color || "primary"
    return (
        <div className={className}>
            <div className={"spinner-border text-" + spinnerColor} style={style} role="status"/>
        </div>
    )
}