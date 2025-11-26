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
    const nameRef = React.useRef(null);

    useEffect(()=>{ window.App.Storage.save('shopping', items); }, [items]);

    function addItem(e){
      e && e.preventDefault();
      const n = name.trim();
      const qn = qty.toString().trim();
      if (!n) return;
      const parsedQty = qn ? Number(qn) : '';
      if (qn && (isNaN(parsedQty) || parsedQty < 0)) return;
      setItems(prev => [{ id: window.App.Utils.uid(), name: n, qty: parsedQty, unit: unit.trim(), done:false }, ...prev]);
      setName(''); setQty(''); setUnit('');
    }
    function toggle(id){ setItems(prev => prev.map(it => it.id===id ? {...it, done: !it.done} : it)); }
    function remove(id){ setItems(prev => prev.filter(it => it.id!==id)); }
    function clearBought(){ setItems(prev => prev.filter(it => !it.done)); }
    function clearAll(){ if(items.length > 0 && window.confirm('Remove all items from your list?')) setItems([]); }

    const bought = items.filter(it=>it.done).length;
    const remaining = items.length - bought;
    const filteredItems = items.filter(it=>{
      if (filter === 'active') return !it.done;
      if (filter === 'bought') return it.done;
      return true;
    });

    return h('section', {className:'space-y-4 anim-fade-up'},
      h('div', {className:'card p-5 relative overflow-hidden bg-white/90'},
        h('div', {className:'absolute -top-8 -right-8 w-36 h-36 bg-[#FCE7F1] rounded-full blur-2xl opacity-60','aria-hidden':'true'}),
        h('div', {className:'absolute -bottom-10 -left-10 w-40 h-40 bg-[#FDF2F8] rounded-full blur-2xl opacity-60','aria-hidden':'true'}),
        h('div', {className:'relative z-10 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4'},
          h('div', null,
            h('h3', {className: "font-['Plus Jakarta Sans'] font-extrabold text-xl flex items-center gap-2"}, 'Your Shopping List'),
            h('div', {className:'mt-2 flex flex-wrap items-center gap-2 text-sm'},
              h('span', {className:'chip bg-[#FCE7F1]'}, `${remaining} remaining`),
              h('span', {className:'chip bg-[#FDF2F8]'}, `${bought} bought`),
              h('span', {className:'chip'}, `${items.length} total`)
            )
          ),
          h('div', {className:'flex items-center gap-2 w-full sm:w-auto'},
            h('div', {className:'hidden sm:flex rounded-lg p-1 bg-white/70 ring-1 ring-black/5'},
              h('button', {className:'px-3 py-1.5 rounded-md text-sm ' + (filter==='all' ? 'bg-[#7C1D3D] text-white shadow' : 'text-[#3a515f] hover:bg-black/5'), onClick:()=>setFilter('all')}, 'All'),
              h('button', {className:'px-3 py-1.5 rounded-md text-sm ' + (filter==='active' ? 'bg-[#7C1D3D] text-white shadow' : 'text-[#3a515f] hover:bg-black/5'), onClick:()=>setFilter('active')}, 'Active'),
              h('button', {className:'px-3 py-1.5 rounded-md text-sm ' + (filter==='bought' ? 'bg-[#7C1D3D] text-white shadow' : 'text-[#3a515f] hover:bg-black/5'), onClick:()=>setFilter('bought')}, 'Bought')
            ),
            h('button', {className:'btn-secondary text-[#C81E58] border-[#C81E58]/20 hover:bg-[#FFF1F5] flex-1 sm:flex-none flex items-center justify-center', onClick:clearAll, disabled:items.length===0, 'aria-disabled': items.length===0}, 'Clear all'),
            h('button', {className:'btn-secondary flex-1 sm:flex-none flex items-center justify-center', onClick:clearBought, disabled:bought===0, 'aria-disabled': bought===0}, 'Clear bought')
          )
        )
      ),
      h('form', {className:'card p-4 grid grid-cols-1 sm:grid-cols-4 gap-3 bg-white/90', onSubmit:addItem},
        h('input', {ref:nameRef, className:'field sm:col-span-2', placeholder:'Add item (e.g., tomatoes)', value:name, onChange:e=>setName(e.target.value), 'aria-label':'Item name'}),
        h('input', {className:'field', placeholder:'Qty', inputMode:'decimal', value:qty, onChange:e=>setQty(e.target.value), 'aria-label':'Quantity'}),
        h('input', {className:'field', placeholder:'Unit (cup, g, pcs)', value:unit, onChange:e=>setUnit(e.target.value), 'aria-label':'Unit'}),
        h('div', {className:'sm:col-span-4 flex justify-end'},
          h('button', {type:'submit', className:'btn-primary flex items-center gap-2'}, h(Icon, {name:'add'}), 'Add Item')
        )
      ),
      filteredItems.length === 0 ? h('div', {className:'card p-8 text-center bg-white/80'},
        h('div', {className:'text-5xl mb-2 anim-floaty','aria-hidden':'true'}, '🛒'),
        h('p', {className:'text-[#3a515f]'}, (bought===items.length && items.length>0) ? 'All done! Enjoy your meal prep.' : 'No items to show. Add ingredients above.'),
        h('div', {className:'mt-4'},
          h('button', {className:'btn-secondary', onClick:()=> nameRef.current && nameRef.current.focus()}, 'Add your first item')
        )
      ) :
      h('ul', {className:'space-y-2'}, filteredItems.map(it => {
        const liCls = 'card p-3 flex items-center gap-3 transition-all duration-300 ' + (it.done ? 'bg-[#EAF2FF]/60' : 'bg-white');
        return h('li', {key:it.id, className: liCls},
          h('button', {className:'btn-secondary !px-0 !py-0 rounded-full w-9 h-9 flex items-center justify-center', onClick:()=>toggle(it.id), 'aria-pressed':it.done, 'aria-label': it.done ? 'Mark as not bought' : 'Mark as bought'},
            it.done ? h(Icon, {name:'check'}) : h('span', {className:'block w-4 h-4 rounded-full ring-2 ring-[#7C1D3D]'}, '')
          ),
          h('div', {className:'flex-1'},
            h('p', {className: (it.done ? 'line-through text-[#3a515f]' : 'text-[#12212B]') + ' font-medium'}, it.name),
            (it.qty || it.unit) ? h('p', {className:'text-xs text-[#3a515f]'}, `${it.qty || ''} ${it.unit || ''}`) : null
          ),
          h('button', {className:'btn-secondary !px-3 !py-2', onClick:()=>remove(it.id), 'aria-label':'Remove'}, h(Icon, {name:'trash'}))
        );
      }))
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

    async function handleSend(e) {
      e && e.preventDefault();
      if (!input.trim() || !ready || loading) return;
      const text = input.trim();
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
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    function handleStop() {
      if(window.AppLLM) window.AppLLM.stop();
      setLoading(false);
    }

    function clearChat() {
       if(window.confirm('Clear conversation history?')) setMessages([]);
    }

    return h('section', { className: 'anim-fade-up space-y-4' },
      h('div', { className: 'card p-6 bg-white/90 relative overflow-hidden' },
        h('div', { className: 'absolute -top-10 -right-10 w-40 h-40 bg-[#FCE7F1] rounded-full blur-3xl opacity-60 pointer-events-none' }),
        h('div', { className: 'relative z-10 flex items-center justify-between' },
          h('div', null,
            h('h2', { className: "font-['Plus Jakarta Sans'] font-extrabold text-2xl flex items-center gap-2" }, 
              h(Icon, { name: 'chef' }), 'Chef Assistant'
            ),
            h('p', { className: 'text-[#3a515f] mt-1' }, 'Tell me what ingredients you have!')
          ),
          messages.length > 0 && h('button', { onClick: clearChat, className: 'btn-secondary text-xs px-3 py-1' }, 'Clear')
        )
      ),

      // Error State
      error && h('div', { className: 'bg-red-50 text-red-800 p-4 rounded-xl border border-red-200 text-sm' }, 
        h('strong', null, 'Error: '), error
      ),

      // Loading/Progress State
      (!ready && !error) && h('div', { className: 'card p-8 text-center space-y-4' },
        h('div', { className: 'inline-block animate-spin rounded-full h-8 w-8 border-4 border-[#7C1D3D] border-t-transparent' }),
        h('p', { className: 'font-medium text-[#12212B]' }, 'Warming up the AI chef...'),
        h('div', { className: 'w-full max-w-xs mx-auto bg-gray-200 rounded-full h-2.5 overflow-hidden' },
          h('div', { className: 'bg-[#7C1D3D] h-2.5 rounded-full transition-all duration-300', style: { width: progress + '%' } })
        ),
        h('p', { className: 'text-xs text-[#3a515f]' }, `Downloading model: ${progress}% (happens once)`)
      ),

      // Chat Area
      ready && h('div', { className: 'space-y-4' },
        h('div', { className: 'space-y-4 pb-2' },
          messages.map(msg => 
            h('div', { key: msg.id, className: `flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}` },
              h('div', { className: `max-w-[90%] sm:max-w-[80%] rounded-2xl p-4 shadow-sm whitespace-pre-wrap ${msg.role === 'user' ? 'bg-[#7C1D3D] text-white rounded-br-none' : 'bg-white text-[#12212B] rounded-bl-none border border-black/5'}` },
                msg.content || (msg.role === 'assistant' && loading ? 'Thinking...' : '')
              )
            )
          ),
          h('div', { ref: chatEndRef })
        ),

        // Input Area
        h('form', { onSubmit: handleSend, className: 'relative' },
          h('textarea', {
            value: input,
            onChange: e => setInput(e.target.value),
            placeholder: 'e.g., I have chicken, rice, tomatoes, and thyme...',
            className: 'field pr-14 min-h-[80px] resize-none',
            onKeyDown: e => { if(e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }
          }),
          loading 
            ? h('button', { type: 'button', onClick: handleStop, className: 'absolute bottom-3 right-3 btn-secondary !px-2 !py-2 rounded-lg', title: 'Stop' }, h(Icon, { name: 'stop' }))
            : h('button', { type: 'submit', disabled: !input.trim(), className: 'absolute bottom-3 right-3 btn-primary !px-2 !py-2 rounded-lg disabled:opacity-50' }, h(Icon, { name: 'send' }))
        )
      )
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
