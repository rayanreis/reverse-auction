const FilterDropdownItems = ({ type }) => {
  const items = {
    category: [
      { value: '', label: 'All Categories' },
      { value: 'content-writing', label: 'Content Writing' },
      { value: 'digital-marketing', label: 'Digital Marketing' },
      { value: 'web-development', label: 'Web Development' },
      { value: 'graphic-design', label: 'Graphic Design' },
      { value: 'big-tech-projects', label: 'Big Tech Projects' }
    ],
    priceRange: [
      { value: '', label: 'Any Price' },
      { value: '0-100', label: '$0 - $100' },
      { value: '101-500', label: '$101 - $500' },
      { value: '501+', label: '$501+' }
    ],
    status: [
      { value: 'all', label: 'All' },
      { value: 'active', label: 'Active' },
      { value: 'ending-soon', label: 'Ending Soon' },
      { value: 'ended', label: 'Ended' }
    ]
  };

  return items[type].map(item => (
    <option key={item.value} value={item.value}>{item.label}</option>
  ));
};

export default FilterDropdownItems; 