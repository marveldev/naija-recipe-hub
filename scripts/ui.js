(function(){
  'use strict';
  window.App = window.App || {};

  // React aliases
  const React = window.React;
  const ReactDOM = window.ReactDOM;
  const h = React.createElement;
  const useState = React.useState;
  const useEffect = React.useEffect;
  const useMemo = React.useMemo;

  // Helpers
  const minutes = (n) => window.App.Utils.minutes(n);

  function Icon({name, className}){
    const props = {width: 18, height: 18, fill: 'none', stroke: 'currentColor', strokeWidth: 1.5, 'aria-hidden': 'true', className};
    if (name === 'clock') return h('svg', props, h('path', {d:'M12 7v5l3 3', stroke:'currentColor'}), h('circle', {cx:12, cy:12, r:9, stroke:'currentColor'}));
    if (name === 'servings') return h('svg', props, h('path', {d:'M4 11h16M5 7h14M6 15h12', stroke:'currentColor'}));
    if (name === 'add') return h('svg', props, h('path', {d:'M12 5v14M5 12h14', stroke:'currentColor'}));
    if (name === 'check') return h('svg', props, h('path', {d:'M5 12l4 4 10-10', stroke:'currentColor'}));
    if (name === 'trash') return h('svg', props, h('path', {d:'M6 7h12M10 7V5h4v2M7 7l1 12h8l1-12', stroke:'currentColor'}));
    if (name === 'home') return h('svg', props, h('path', {d:'M3 10.5L12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1v-9.5z', stroke:'currentColor'}));
    if (name === 'list') return h('svg', props, h('path', {d:'M6 7h12l-1.2 12.2A1 1 0 0 1 15.8 20H8.2a1 1 0 0 1-1-.8L6 7zm3-3h6v3H9V4z', stroke:'currentColor'}));
    if (name === 'chef') return h('svg', props, h('path', {d:'M6 13.87A4 4 0 0 1 7.41 6a5.11 5.11 0 0 1 1.05-1.54 5 5 0 0 1 7.08 0A5.11 5.11 0 0 1 16.59 6 4 4 0 0 1 18 13.87V21H6Z', stroke:'currentColor'}), h('path', {d:'M6 17h12', stroke:'currentColor'}));
    if (name === 'send') return h('svg', props, h('path', {d:'M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z', stroke:'currentColor'}));
    if (name === 'stop') return h('svg', props, h('rect', {x:6, y:6, width:12, height:12, stroke:'currentColor'}));
    return null;
  }

  function Badge({children}){
    return h('span', {className: 'chip'}, children);
  }
  function Modal({isOpen, onClose, title, children, footer}){
    if(!isOpen) return null;
    const modal = h('div', {className: 'fixed inset-0 flex items-center justify-center p-4', style: {zIndex: 200}},
      h('div', {className: 'absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity', onClick: onClose}),
      h('div', {className: 'relative bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6 ring-1 ring-black/5 anim-fade-up'},
        title && h('h3', {className: "font-['Plus Jakarta Sans'] font-bold text-lg text-[#12212B] mb-2"}, title),
        h('div', {className: "text-[#3a515f] text-sm leading-relaxed mb-6"}, children),
        footer && h('div', {className: "flex items-center justify-end gap-3"}, footer)
      )
    );
    return ReactDOM.createPortal(modal, document.body);
  }

  function Header({onNav, route}){
    return h('div', {className: 'flex items-center gap-3 md:hidden mb-3'},
      h('button', {className: 'btn-secondary flex items-center gap-2', onClick: () => onNav('home')}, h(Icon, {name:'home'}), 'Home'),
      h('button', {className: 'btn-primary flex items-center gap-2', onClick: () => onNav('shopping')}, h(Icon, {name:'list'}), 'Shopping List')
    );
  }

  function RecipeCard({r, onOpen}){
    return h('article', {className: 'card overflow-hidden card-hover'},
      h('div', {className: 'p-5 flex flex-col gap-3 bg-white relative'},
        h('div', {className: 'rounded-xl h-28 w-full', style: {backgroundColor: r.color}},
          h('div', {className: 'h-full w-full flex items-center justify-center text-[42px] anim-floaty'}, '🍲')
        ),
        h('div', {className: 'flex items-start justify-between gap-3'},
          h('h3', {className: "font-['Plus Jakarta Sans'] font-extrabold text-xl"}, r.name),
          h('span', {className: 'tag'}, 'Naija')
        ),
        h('p', {className: 'text-[#3a515f] text-sm line-clamp-2'}, r.description),
        h('div', {className: 'flex items-center gap-4 text-sm text-[#3a515f]'},
          h('span', {className: 'inline-flex items-center gap-1'}, h(Icon, {name: 'servings'}), r.servings + ' servings'),
          h('span', {className: 'inline-flex items-center gap-1'}, h(Icon, {name: 'clock'}), minutes(r.time))
        ),
        h('div', {className: 'pt-2'},
          h('button', {className: 'btn-secondary w-full', onClick: () => onOpen(r.id), 'aria-label':'Open recipe details'}, 'View Recipe')
        )
      )
    );
  }

  function SearchBar({value, onChange}){
    return h('div', {className: 'mb-4'},
      h('input', {className: 'field', placeholder: 'Search recipes (e.g., jollof, suya, egusi)', value, onChange: (e)=>onChange(e.target.value), 'aria-label':'Search recipes'})
    );
  }

  function RecipeList({recipes, onOpen}){
    const [query, setQuery] = useState('');
    const filtered = useMemo(() => {
      const q = query.trim().toLowerCase();
      if (!q) return recipes;
      return recipes.filter(r => r.name.toLowerCase().includes(q) || r.description.toLowerCase().includes(q));
    }, [recipes, query]);

    return h('section', {className: 'space-y-4 anim-fade-up'},
      h(SearchBar, {value: query, onChange: setQuery}),
      h('div', {className: 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5'},
        filtered.map(r => h(RecipeCard, {key: r.id, r, onOpen}))
      )
    );
  }

  function RecipeDetail({recipe, onBack, onAddAll}){
    return h('section', {className: 'anim-fade-up'},
      h('div', {className: 'relative'},
        // Immersive Header with Back Button and Hero
        h('div', {className: 'relative h-64 sm:h-80 w-full rounded-b-[2.5rem] sm:rounded-3xl overflow-hidden shadow-lg transform translate-z-0', style: {backgroundColor: recipe.color}},
          h('div', {className: 'absolute top-[-50%] right-[-10%] w-[80%] h-[150%] rounded-full bg-white/20 blur-3xl'}),
          h('div', {className: 'absolute bottom-[-20%] left-[-10%] w-[60%] h-[100%] rounded-full bg-black/5 blur-2xl'}),
          
          h('button', {
            onClick: onBack,
            className: 'absolute top-4 left-4 sm:top-6 sm:left-6 z-20 w-12 h-12 rounded-full bg-white/30 backdrop-blur-md border border-white/20 flex items-center justify-center text-[#12212B] hover:bg-white/50 hover:scale-105 transition-all shadow-sm',
            'aria-label': 'Go back'
          }, h('svg', {width:24,height:24,viewBox:'0 0 24 24',fill:'none',stroke:'currentColor',strokeWidth:2.5,strokeLinecap:'round',strokeLinejoin:'round'}, h('path', {d:'M15 18l-6-6 6-6'}))),
          
          h('div', {className: 'absolute inset-0 flex items-center justify-center'},
             h('div', {className: 'text-[96px] sm:text-[120px] filter drop-shadow-xl anim-floaty'}, '🥘')
          )
        ),

        // Main Content Card (overlapping the header)
        h('div', {className: 'max-w-5xl mx-auto px-4 sm:px-6 relative -mt-12 sm:-mt-20 z-10 pb-12'},
          h('div', {className: 'bg-white rounded-[2rem] shadow-xl p-6 sm:p-10 ring-1 ring-black/5'},
            
            // Recipe Header Info
            h('div', {className: 'text-center mb-10'},
              h('h2', {className: "font-['Plus Jakarta Sans'] font-black text-3xl sm:text-5xl text-[#12212B] mb-4 tracking-tight leading-tight"}, recipe.name),
              h('p', {className: 'text-lg sm:text-xl text-[#3a515f] leading-relaxed max-w-2xl mx-auto font-medium'}, recipe.description),
              
              h('div', {className: 'flex flex-wrap items-center justify-center gap-3 mt-6'},
                h('div', {className: 'inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#F7FAF8] border border-[#7C1D3D]/10 text-[#7C1D3D] font-bold text-sm'},
                   h(Icon, {name: 'servings'}),
                   h('span', null, recipe.servings + ' servings')
                ),
                h('div', {className: 'inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#F7FAF8] border border-[#7C1D3D]/10 text-[#7C1D3D] font-bold text-sm'},
                   h(Icon, {name: 'clock'}),
                   h('span', null, minutes(recipe.time))
                )
              )
            ),

            // Two-column Content Grid
            h('div', {className: 'grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12'},
              
              // Ingredients Column (Left)
              h('div', {className: 'lg:col-span-5 order-2 lg:order-1'},
                h('div', {className: 'bg-[#FFF9F3] rounded-3xl p-6 sm:p-8 border border-[#FFE4C4]/60'},
                  h('div', {className: 'flex items-baseline justify-between mb-6'},
                    h('h3', {className: "font-['Plus Jakarta Sans'] font-extrabold text-xl text-[#593825]"}, 'Ingredients'),
                    h('span', {className: 'text-xs font-bold uppercase tracking-wider text-[#A67C52] bg-[#FFE4C4]/40 px-2 py-1 rounded-md'}, recipe.ingredients.length + ' items')
                  ),
                  h('ul', {className: 'space-y-4'},
                    recipe.ingredients.map((ing, i) => {
                      const qtyStr = (ing.qty && ing.qty !== 'to taste' ? ing.qty + ' ' : '') + (ing.unit && ing.unit !== 'to taste' ? ing.unit + ' ' : '');
                      const nameStr = ing.item + ((ing.qty==='to taste'||ing.unit==='to taste') ? ' (to taste)' : '');
                      return h('li', {key: i, className: 'flex items-start gap-3'},
                         h('div', {className: 'mt-1.5 w-2 h-2 rounded-full bg-[#D4A373] flex-shrink-0'}),
                         h('div', {className: 'text-[#4A3B32] font-medium leading-snug flex-1'},
                           qtyStr && h('span', {className: 'font-bold text-[#593825]'}, qtyStr),
                           h('span', null, nameStr)
                         )
                      );
                    })
                  ),
                  h('div', {className: 'mt-8'},
                     h('button', {
                       className: 'w-full btn-primary py-3.5 flex items-center justify-center gap-2 shadow-lg shadow-[#7C1D3D]/20 hover:shadow-[#7C1D3D]/30 active:scale-[0.98]',
                       onClick: () => onAddAll(recipe)
                     }, h(Icon, {name:'add'}), 'Add to Shopping List')
                  )
                )
              ),

              // Instructions Column (Right)
              h('div', {className: 'lg:col-span-7 order-1 lg:order-2'},
                h('div', {className: 'mb-6 flex items-center gap-3'},
                   h('span', {className: 'flex items-center justify-center w-8 h-8 rounded-full bg-[#7C1D3D] text-white'},
                     h('svg', {width:16,height:16,viewBox:'0 0 24 24',fill:'none',stroke:'currentColor',strokeWidth:3,strokeLinecap:'round',strokeLinejoin:'round'}, h('path',{d:'M12 6v6l4 2'}))
                   ),
                   h('h3', {className: "font-['Plus Jakarta Sans'] font-extrabold text-2xl text-[#12212B]"}, 'Instructions')
                ),
                h('div', {className: 'space-y-8 pl-2'},
                  recipe.steps.map((step, i) => 
                    h('div', {key: i, className: 'relative pl-10 group'},
                       // Connected line
                       i < recipe.steps.length - 1 && h('div', {className: 'absolute left-[11px] top-8 bottom-[-24px] w-0.5 bg-[#FCE7F1] group-hover:bg-[#FBCFE8] transition-colors'}),
                       // Step Number
                       h('div', {className: 'absolute left-0 top-1 w-6 h-6 rounded-full bg-[#7C1D3D] text-white text-xs font-bold flex items-center justify-center shadow-sm ring-4 ring-white z-10'}, i + 1),
                       // Text
                       h('p', {className: 'text-lg text-[#3a515f] leading-relaxed group-hover:text-[#12212B] transition-colors font-medium'}, step)
                    )
                  )
                )
              )
            )
          )
        )
      )
    );
  }

  function ShoppingList(){
    const [items, setItems] = useState(()=> window.App.Storage.load('shopping', []));
    const [name, setName] = useState('');
    const [qty, setQty] = useState('');
    const [unit, setUnit] = useState('');
    const [filter, setFilter] = useState('all');
    const [error, setError] = useState(null);
    const [showClearAllConfirm, setShowClearAllConfirm] = useState(false);
    const nameRef = React.useRef(null);

    useEffect(()=>{ window.App.Storage.save('shopping', items); }, [items]);
    function addItem(e){
      e && e.preventDefault();
      const n = name.trim();
      const qn = qty.toString().trim();
      
      if (!n) {
        setError('The input tag cannot be empty');
        if(nameRef.current) nameRef.current.focus();
        return;
      }

      const parsedQty = qn ? Number(qn) : '';
      if (qn && (isNaN(parsedQty) || parsedQty < 0)) return;
      
      setItems(prev => [{ id: window.App.Utils.uid(), name: n, qty: parsedQty, unit: unit.trim(), done:false }, ...prev]);
      setName(''); setQty(''); setUnit(''); setError(null);
    }
    function toggle(id){ setItems(prev => prev.map(it => it.id===id ? {...it, done: !it.done} : it)); }
    function remove(id){ setItems(prev => prev.filter(it => it.id!==id)); }
    function clearAll(){ if(items.length > 0) setShowClearAllConfirm(true); }
    function confirmClearAll(){ setItems([]); setShowClearAllConfirm(false); }
    function clearBought(){ setItems(prev => prev.filter(it => !it.done)); }

    const bought = items.filter(it=>it.done).length;
    const remaining = items.length - bought;
    const filteredItems = items.filter(it=>{
      if (filter === 'active') return !it.done;
      if (filter === 'bought') return it.done;
      return true;
    });

    return h('section', {className:'space-y-4 anim-fade-up'},
      h('div', {className:'card p-5'},
        h('div', {className:'flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4'},
          h('div', null,
            h('h3', {className: "font-['Plus Jakarta Sans'] font-extrabold text-xl flex items-center gap-2"}, 'Your Shopping List'),
            h('div', {className:'mt-2 flex flex-wrap items-center gap-2 text-sm'},
              h('span', {className:'chip bg-[#FCE7F1]'}, `${remaining} remaining`),
              h('span', {className:'chip bg-[#FDF2F8]'}, `${bought} bought`),
              h('span', {className:'chip'}, `${items.length} total`)
            )
          ),
          h('div', {className:'flex flex-col sm:flex-row items-end sm:items-center gap-3 w-full sm:w-auto'},
            items.length > 0 && h('div', {className:'flex items-center gap-2'},
              bought > 0 && h('button', {type:'button', className:'text-xs font-bold text-[#7C1D3D] bg-[#FCE7F1] hover:bg-[#FBCFE8] px-3 py-1.5 rounded-lg transition-colors', onClick:clearBought}, 'Clear Bought'),
              h('button', {type:'button', className:'text-xs font-medium text-red-600 hover:bg-red-50 px-3 py-1.5 rounded-lg transition-colors', onClick:clearAll}, 'Clear All')
            ),
            h('div', {className:'hidden sm:flex rounded-lg p-1 bg-white/70 ring-1 ring-black/5'},
              h('button', {className:'px-3 py-1.5 rounded-md text-sm ' + (filter==='all' ? 'bg-[#7C1D3D] text-white shadow' : 'text-[#3a515f] hover:bg-black/5'), onClick:()=>setFilter('all')}, 'All'),
              h('button', {className:'px-3 py-1.5 rounded-md text-sm ' + (filter==='active' ? 'bg-[#7C1D3D] text-white shadow' : 'text-[#3a515f] hover:bg-black/5'), onClick:()=>setFilter('active')}, 'Active'),
              h('button', {className:'px-3 py-1.5 rounded-md text-sm ' + (filter==='bought' ? 'bg-[#7C1D3D] text-white shadow' : 'text-[#3a515f] hover:bg-black/5'), onClick:()=>setFilter('bought')}, 'Bought')
            )
          )
        )
      ),

      h('form', {className:'card p-5 grid grid-cols-12 gap-3', onSubmit:addItem},
        h('div', {className:'col-span-12 flex flex-col gap-1'},
          h('input', {ref:nameRef, className:'field ' + (error ? '!bg-red-50 !border-red-200 !text-red-900 placeholder:text-red-400 focus:!ring-red-100' : ''), placeholder:'Add item (e.g., tomatoes)', value:name, onChange:e=>{setName(e.target.value); if(error) setError(null);}, 'aria-label':'Item name', 'aria-invalid': !!error}),
          error && h('span', {className:'text-red-600 text-sm font-medium animate-pulse px-1'}, error)
        ),
        h('input', {className:'field col-span-6', type:'number', min:'0', step:'any', placeholder:'Qty', value:qty, onChange:e=>setQty(e.target.value), 'aria-label':'Quantity'}),
        h('input', {className:'field col-span-6', type:'number', step:'any', placeholder:'Unit', value:unit, onChange:e=>setUnit(e.target.value), 'aria-label':'Unit'}),
        h('div', {className:'col-span-12 pt-2 flex sm:justify-end'},
          h('button', {type:'submit', className:'btn-primary w-full sm:w-auto flex items-center justify-center gap-2 shadow-xl shadow-[#7C1D3D]/10'}, h(Icon, {name:'add'}), 'Add Item')
        )
      ),

      filteredItems.length === 0 ? h('div', {className:'text-center py-12'},
        h('p', {className:'text-[#3a515f]'}, (bought===items.length && items.length>0) ? 'All done! Enjoy your meal prep.' : 'No items to show. Add ingredients above.'),
        h('div', {className:'mt-4'},
          h('button', {type:'button', className:'btn-secondary', onClick:()=> nameRef.current && nameRef.current.focus()}, 'Add your first item')
        )
      ) :
      h('ul', {className:'space-y-2'}, filteredItems.map(it => {
        const liCls = 'card p-3 flex items-center gap-3 transition-all duration-300 ' + (it.done ? 'bg-[#EAF2FF]/60' : 'bg-white');
        const q = it.qty;
        const u = (it.unit || '').trim();
        const hasQ = q !== '' && q !== null && q !== undefined;
        const detail = (hasQ && u) ? `${q} ${u}` : (hasQ ? `${q} qty` : u);

        return h('li', {key:it.id, className: liCls},
          h('button', {className:'btn-secondary !px-0 !py-0 rounded-full w-9 h-9 flex items-center justify-center', onClick:()=>toggle(it.id), 'aria-pressed':it.done, 'aria-label': it.done ? 'Mark as not bought' : 'Mark as bought'},
            it.done ? h(Icon, {name:'check'}) : h('span', {className:'block w-4 h-4 rounded-full ring-2 ring-[#7C1D3D]'}, '')
          ),
          h('div', {className:'flex-1'},
            h('p', {className: (it.done ? 'line-through text-[#3a515f]' : 'text-[#12212B]') + ' font-medium'}, it.name),
            detail ? h('p', {className:'text-xs text-[#3a515f]'}, detail) : null
          ),
          h('button', {
            className: 'flex-none w-9 h-9 flex items-center justify-center text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors',
            onClick: () => remove(it.id),
            'aria-label': 'Delete item',
            title: 'Delete item'
          }, h(Icon, {name:'trash'}))
        );
      })),
      h(Modal, {
        isOpen: showClearAllConfirm,
        onClose: () => setShowClearAllConfirm(false),
        title: 'Clear Shopping List',
        footer: [
          h('button', {key:'cancel', className: 'btn-secondary py-2 px-4 text-sm', onClick: () => setShowClearAllConfirm(false)}, 'Cancel'),
          h('button', {key:'confirm', className: 'btn-primary py-2 px-4 text-sm !bg-red-600 hover:!bg-red-700 active:scale-[0.98]', onClick: confirmClearAll}, 'Clear All')
        ]
      }, 'Are you sure you want to remove all items from your shopping list? This action cannot be undone.')
    );
  }

  function ChefAssistant(){
    const [messages, setMessages] = useState(() => window.App.Storage.load('chef_history', []));
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [initializing, setInitializing] = useState(false);
    const [ready, setReady] = useState(window.AppLLM && window.AppLLM.ready);
    const [error, setError] = useState(null);
    const [showClearConfirm, setShowClearConfirm] = useState(false);
    const chatEndRef = React.useRef(null);

    useEffect(() => {
      window.App.Storage.save('chef_history', messages);
      if(chatEndRef.current) chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    useEffect(() => {
      if (!ready && !initializing && window.AppLLM) {
        setInitializing(true);
        window.AppLLM.load(undefined, setProgress)
          .then(() => {
            setReady(true);
            setInitializing(false);
          })
          .catch(err => {
            console.error(err);
            setError(err.message || 'WebGPU not available or model failed');
            setInitializing(false);
          });
      }
    }, [ready, initializing]);

    async function handleSend(e, textOverride) {
      if(e) e.preventDefault();
      const text = textOverride || input.trim();
      if (!text || !ready || loading) return;

      setInput('');
      
      const userMsg = { role: 'user', content: text, id: Date.now() };
      setMessages(prev => [...prev, userMsg]);
      setLoading(true);
      setError(null);

      const aiMsgId = Date.now() + 1;
      setMessages(prev => [...prev, { role: 'assistant', content: '', id: aiMsgId }]);

      try {
        let fullText = '';
        await window.AppLLM.generate(text, {
          system: 'You are a friendly, expert Nigerian chef. The user will list ingredients they have. Suggest a creative, delicious Nigerian or fusion recipe they can cook. Include a Title, Ingredients list, and Instructions. Keep it concise and encouraging.',
          onToken: (token) => {
            fullText += token;
            setMessages(prev => prev.map(m => m.id === aiMsgId ? { ...m, content: fullText } : m));
          }
        });
      } catch (err) {
        console.error(err);
        setError('Connection interrupted. Please try again.');
        setMessages(prev => prev.map(m => m.id === aiMsgId ? { ...m, content: 'Sorry, I encountered an error. Please try again.' } : m));
      } finally {
        setLoading(false);
      }
    }

    function handleStop() {
      if(window.AppLLM) window.AppLLM.stop();
      setLoading(false);
    }

    function clearChat() {
       setShowClearConfirm(true);
    }

    function confirmClear() {
       setMessages([]);
       setShowClearConfirm(false);
    }
    
    const suggestions = [
      'I have rice, chicken, and thyme',
      'Vegetarian ideas for spinach',
      'What can I cook with yam?',
      'Quick dinner with plantains'
    ];

    return h('section', { className: 'anim-fade-up h-[calc(100vh-200px)] min-h-[500px] flex flex-col' },
      h('div', { className: 'flex-none mb-4' },
        h('div', { className: 'bg-white rounded-2xl p-4 sm:p-5 shadow-sm ring-1 ring-black/5 flex items-center justify-between' },
           h('div', { className: 'flex items-center gap-3 sm:gap-4' },
              h('div', { className: 'w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[#FCE7F1] flex items-center justify-center text-[#7C1D3D]' }, h(Icon, {name:'chef', className:'w-5 h-5 sm:w-6 sm:h-6'})),
              h('div', null,
                 h('h2', { className: "font-['Plus Jakarta Sans'] font-extrabold text-lg sm:text-xl" }, 'Chef Assistant'),
                 h('p', { className: 'text-xs sm:text-sm text-[#3a515f]' }, 'AI-powered culinary expert')
              )
           ),
           messages.length > 0 && h('button', { onClick: clearChat, className: 'text-xs font-medium text-[#7C1D3D] hover:bg-[#FCE7F1] px-3 py-1.5 rounded-full transition-colors' }, 'Clear')
        )
      ),

      h('div', { className: 'flex-1 overflow-y-auto min-h-0 space-y-6 pb-4 px-1' },
         error && h('div', { className: 'bg-red-50 text-red-800 p-4 rounded-xl border border-red-200 text-sm' }, h('strong', null, 'Error: '), error),

         (!ready && !error) && h('div', { className: 'flex flex-col items-center justify-center h-full text-center space-y-6 p-8' },
            h('div', { className: 'relative w-16 h-16 sm:w-20 sm:h-20' },
              h('div', { className: 'absolute inset-0 rounded-full border-4 border-[#FCE7F1]' }),
              h('div', { className: 'absolute inset-0 rounded-full border-4 border-[#7C1D3D] border-t-transparent animate-spin' }),
              h('div', { className: 'absolute inset-0 flex items-center justify-center text-2xl' }, '👨🏾🍳')
            ),
            h('div', { className: 'space-y-2' },
              h('h3', { className: 'font-bold text-lg' }, 'Chef is getting ready...'),
              h('p', { className: 'text-[#3a515f] text-sm max-w-xs mx-auto' }, 'Downloading the knowledge base. This happens once.'),
              h('div', { className: 'w-48 sm:w-64 h-2 bg-gray-100 rounded-full mx-auto overflow-hidden mt-4' },
                h('div', { className: 'h-full bg-[#7C1D3D] transition-all duration-300', style: { width: progress + '%' } })
              ),
              h('p', { className: 'text-xs text-[#3a515f] font-mono mt-1' }, `${progress}%`)
            )
         ),
         
         (ready && messages.length === 0) && h('div', { className: 'flex flex-col items-center justify-center h-full space-y-8 p-4 anim-fade-up' },
            h('div', { className: 'w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-br from-[#FCE7F1] to-white shadow-inner flex items-center justify-center text-4xl mb-2' }, '🍳'),
            h('div', { className: 'text-center space-y-2 max-w-md' },
              h('h3', { className: 'font-bold text-lg sm:text-xl' }, 'What are we cooking?'),
              h('p', { className: 'text-[#3a515f] text-sm sm:text-base' }, 'Tell me what ingredients you have, or ask for a recipe.')
            ),
            h('div', { className: 'grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-lg' },
              suggestions.map(s => h('button', {
                key: s,
                onClick: () => handleSend(null, s),
                className: 'text-left p-3 sm:p-4 rounded-xl bg-white border border-[#7C1D3D]/10 hover:border-[#7C1D3D]/30 hover:shadow-md hover:-translate-y-0.5 transition-all text-sm text-[#3a515f] font-medium group'
              }, 
                h('span', {className:'group-hover:text-[#7C1D3D] transition-colors'}, s)
              ))
            )
         ),

         ready && messages.length > 0 && h('div', { className: 'space-y-6' },
            messages.map(msg => {
              const isAi = msg.role === 'assistant';
              return h('div', { key: msg.id, className: `flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} anim-fade-up` },
                isAi && h('div', { className: 'hidden sm:flex w-8 h-8 rounded-full bg-[#7C1D3D] flex-shrink-0 items-center justify-center text-white mr-3 mt-1 shadow-sm' }, h(Icon, {name:'chef', className:'w-4 h-4'})),
                h('div', { className: `max-w-[85%] sm:max-w-[75%] rounded-2xl px-4 py-3 sm:px-5 sm:py-4 shadow-sm text-[15px] leading-relaxed ${isAi ? 'bg-white text-[#12212B] rounded-bl-sm border border-black/5 markdown-content' : 'bg-[#7C1D3D] text-white rounded-br-sm whitespace-pre-wrap'}` },
                  isAi 
                    ? (msg.content ? h('div', { dangerouslySetInnerHTML: { __html: window.marked ? window.marked.parse(msg.content) : msg.content } }) : (loading ? h('span', {className:'animate-pulse'}, 'Thinking...') : ''))
                    : msg.content
                )
              );
            }),
            h('div', { ref: chatEndRef })
         )
      ),

      ready && h('div', { className: 'flex-none mt-2' },
         h('form', { onSubmit: (e)=>handleSend(e), className: 'relative bg-white rounded-2xl shadow-lg ring-1 ring-black/5 p-2 flex items-end gap-2' },
            h('textarea', {
              value: input,
              onChange: e => setInput(e.target.value),
              className: 'w-full bg-transparent border-0 focus:ring-0 text-[#12212B] placeholder:text-gray-400 py-3 pl-3 resize-none max-h-32 min-h-[52px]',
              rows: 1,
              placeholder: 'Type your ingredients...',
              onKeyDown: e => { 
                if(e.key === 'Enter' && !e.shiftKey) { 
                  e.preventDefault(); 
                  handleSend(); 
                }
                e.target.style.height = 'auto';
                e.target.style.height = e.target.scrollHeight + 'px';
              }
            }),
            loading 
              ? h('button', { type: 'button', onClick: handleStop, className: 'flex-none w-10 h-10 rounded-xl bg-gray-100 text-[#3a515f] hover:bg-gray-200 flex items-center justify-center mb-1 mr-1 transition-colors', title: 'Stop' }, h(Icon, { name: 'stop' }))
              : h('button', { type: 'submit', disabled: !input.trim(), className: 'flex-none w-10 h-10 rounded-xl bg-[#7C1D3D] text-white hover:bg-[#6A1834] disabled:opacity-50 disabled:hover:bg-[#7C1D3D] flex items-center justify-center mb-1 mr-1 shadow-md transition-all' }, h(Icon, { name: 'send' }))
         )
      ),

      h(Modal, {
        isOpen: showClearConfirm,
        onClose: () => setShowClearConfirm(false),
        title: 'Clear Conversation',
        footer: [
          h('button', {key:'cancel', className: 'btn-secondary py-2 px-4 text-sm', onClick: () => setShowClearConfirm(false)}, 'Cancel'),
          h('button', {key:'confirm', className: 'btn-primary py-2 px-4 text-sm !bg-red-600 hover:!bg-red-700 active:scale-[0.98]', onClick: confirmClear}, 'Clear All')
        ]
      }, 'Are you sure you want to clear the conversation history? This action cannot be undone.')
    );
  }
  function AppShell(){
    const [route, setRoute] = useState(()=> window.App.Storage.load('route', 'home'));
    const [recipes, setRecipes] = useState(()=> window.App.Data.ensureSeeded());
    const [selected, setSelected] = useState(()=> window.App.Storage.load('selected', null));

    useEffect(()=>{
      window.App.Storage.save('route', route);
      // Notify jQuery bottom nav to update active state
      $(document).trigger('app:navigate', [route]);
    }, [route]);

    useEffect(()=>{
      // Wire mobile bottom nav requests
      function req(_, target){
        if (target === 'home') setRoute('home');
        if (target === 'shopping') setRoute('shopping');
        if (target === 'chef') setRoute('chef');
      }
      $(document).on('app:request-nav', req);
      return () => $(document).off('app:request-nav', req);
    }, []);

    useEffect(()=>{
      const exists = selected && window.App.Data.byId(selected);
      if (!exists) setRoute('home');
    }, [route, selected]);

    useEffect(()=>{ window.App.Storage.save('selected', selected); }, [selected]);

    function openRecipe(id){ setSelected(id); setRoute('detail'); }
    function backHome(){ setRoute('home'); }

    function addAllToShopping(recipe){
      const current = window.App.Storage.load('shopping', []);
      const merged = [...recipe.ingredients.map((ing) => ({ id: window.App.Utils.uid(), name: ing.item, qty: ing.qty === 'to taste' ? '' : ing.qty, unit: ing.unit === 'to taste' ? '' : ing.unit, done:false })), ...current];
      window.App.Storage.save('shopping', merged);
      // gentle toast
      const toast = document.createElement('div');
      toast.className = 'fixed bottom-[88px] left-1/2 -translate-x-1/2 bg-[#7C1D3D] text-white px-4 py-2 rounded-full shadow-xl anim-fade-up';
      toast.textContent = 'Ingredients added to your Shopping List';
      document.body.appendChild(toast);
      setTimeout(()=>{ $(toast).fadeOut(250, function(){ this.remove(); }); }, 1600);
    }

    const selRecipe = selected ? window.App.Data.byId(selected) : null;

    return h('div', {className:'space-y-4'},
      route === 'home' && h('div', null,
        h('h2', {className: "font-['Plus Jakarta Sans'] font-black text-2xl mb-2"}, 'Popular Nigerian Recipes'),
        h(RecipeList, {recipes, onOpen: openRecipe})
      ),
      route === 'detail' && selRecipe && h(RecipeDetail, {recipe: selRecipe, onBack: backHome, onAddAll: addAllToShopping}),
      route === 'chef' && h(ChefAssistant, null),
      route === 'shopping' && h(ShoppingList, null),
    );
  }

  window.App.init = function(){
    // Nothing heavy to init here; data seeding is in helpers
  };

  window.App.render = function(){
    const rootEl = document.getElementById('app-root');
    if (!rootEl) { console.error('Missing #app-root'); return; }
    let rootInstance = null;
    if (ReactDOM && typeof ReactDOM.createRoot === 'function') {
      rootInstance = ReactDOM.createRoot(rootEl);
      rootInstance.render(h(AppShell));
    } else if (window.ReactDOMClient && typeof window.ReactDOMClient.createRoot === 'function') {
      rootInstance = window.ReactDOMClient.createRoot(rootEl);
      rootInstance.render(h(AppShell));
    } else if (ReactDOM && typeof ReactDOM.render === 'function') {
      ReactDOM.render(h(AppShell), rootEl);
    } else {
      console.error('ReactDOM missing createRoot/render');
    }
    // Desktop header buttons (outside React) delegate route change via custom event
    $('#go-home').on('click', function(){ $(document).trigger('app:request-nav', ['home']); });
    $('#go-shopping').on('click', function(){ $(document).trigger('app:request-nav', ['shopping']); });
    $('#go-chef').on('click', function(){ $(document).trigger('app:request-nav', ['chef']); });
  };
})();
