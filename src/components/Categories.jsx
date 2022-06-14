import React, {useState} from "react";

export function Categories() {
    const [activeIndex, setActiveIndex] = useState(0)
    const categories = ['Все', 'Мячные', 'Вегетариансткая', 'Гриль', 'Острые', 'Закрытые']
    const onClickCategory = (index) => {
        setActiveIndex(index)
    }


    return (
        <div className="categories">
            <ul>
                {categories.map((value, index) => (
                    <li key={index}
                        onClick={() => onClickCategory(index)}
                        className={activeIndex === index ? 'active' : ''}>
                        {value}
                    </li>
                ))}

            </ul>
        </div>
    )
}