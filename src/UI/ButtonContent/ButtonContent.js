import styles from './ButtonContent.module.css'

const ButtonContent = ({text}) =>{
    return(
        <>
        <span className={styles.longtext}>{text}</span><span className={styles.shorttext}>{text}</span>  
        </>
    )
}

export default ButtonContent