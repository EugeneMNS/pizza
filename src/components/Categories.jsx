import React, {useState} from "react";

export function Categories({value, onChangeCategory}) {
    const categories = ['Все', 'Мясные', 'Вегетариансткая', 'Гриль', 'Острые', 'Закрытые']



    return (
        <div className="categories">
            <ul>
                {categories.map((categoryName, i) => (
                    <li key={i}
                        onClick={() => onChangeCategory(i)}
                        className={value === i ? 'active' : ''}>
                        {categoryName}
                    </li>
                ))}

            </ul>
        </div>
    )
}