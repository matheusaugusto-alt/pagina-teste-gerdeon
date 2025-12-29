
import React, { useState, memo, useEffect, useRef } from 'react';
import { 
  CheckCircle, 
  ChevronDown, 
  UserCheck, 
  Users, 
  BookOpen, 
  XCircle,
  Globe,
  Zap,
  ShieldCheck,
  Star,
  Plus,
  Clock
} from 'lucide-react';

// --- Types ---

interface SectionTitleProps {
  children: React.ReactNode;
  subtitle?: string;
}

interface ButtonProps {
  href: string;
  children: React.ReactNode;
  variant?: 'primary' | 'whatsapp';
  className?: string;
}

interface CourseCardProps {
  title: string;
  description: string;
  icon: React.ElementType;
}

interface FAQItemProps {
  question: string;
  answer: string;
}

// Fix: Explicitly define props interface for RevealSection to handle children and key correctly in TS
interface RevealSectionProps {
  children?: React.ReactNode;
  className?: string;
  key?: React.Key;
}

// --- Custom Hooks ---

const useScrollReveal = () => {
  const [isVisible, setIsVisible] = useState(false);
  const domRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      });
    });

    const current = domRef.current;
    if (current) observer.observe(current);
    
    return () => {
      if (current) observer.unobserve(current);
    };
  }, []);

  return { isVisible, domRef };
};

// --- Helper Components ---

// Fix: Use RevealSectionProps interface and make children optional to resolve "property children is missing" errors in various usages
const RevealSection = ({ children, className = "" }: RevealSectionProps) => {
  const { isVisible, domRef } = useScrollReveal();
  return (
    <div 
      ref={domRef} 
      className={`transition-all duration-1000 transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'} ${className}`}
    >
      {children}
    </div>
  );
};

const CountdownTimer = () => {
  const [timeLeft, setTimeLeft] = useState({ hours: 1, minutes: 24, seconds: 59 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        if (prev.hours > 0) return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const format = (n: number) => n.toString().padStart(2, '0');

  return (
    <div className="flex justify-center gap-4 mb-8">
      {[
        { label: 'HORAS', val: timeLeft.hours },
        { label: 'MIN', val: timeLeft.minutes },
        { label: 'SEG', val: timeLeft.seconds }
      ].map((item, i) => (
        <div key={i} className="flex flex-col items-center">
          <div className="bg-white/10 backdrop-blur-md border border-white/20 px-4 py-3 rounded-xl min-w-[70px]">
            <span className="text-2xl md:text-3xl font-black text-[#FF7A00] leading-none">{format(item.val)}</span>
          </div>
          <span className="text-[10px] font-bold mt-2 text-gray-500 tracking-widest">{item.label}</span>
        </div>
      ))}
    </div>
  );
};

const SectionTitle = memo(({ children, subtitle }: SectionTitleProps) => (
  <div className="text-center mb-16 px-4">
    <h2 className="text-4xl md:text-6xl font-black text-white leading-tight uppercase font-montserrat tracking-tighter">
      {children}
    </h2>
    {subtitle && (
      <p className="text-[#FF7A00] font-bold mt-4 text-lg md:text-xl max-w-3xl mx-auto uppercase tracking-widest opacity-90">
        {subtitle}
      </p>
    )}
  </div>
));

const Button = memo(({ href, children, variant = 'primary', className = '' }: ButtonProps) => {
  const baseStyles = "btn-shine inline-flex items-center justify-center px-10 py-5 rounded-full font-black text-lg transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-2xl uppercase tracking-tighter text-center cursor-pointer";
  const variants = {
    primary: "bg-[#FF7A00] text-black hover:bg-[#FFA800]",
    whatsapp: "bg-green-600 text-white hover:bg-green-500",
  };

  return (
    <a 
      href={href} 
      target="_blank" 
      rel="noopener noreferrer" 
      className={`${baseStyles} ${variants[variant]} ${className}`}
    >
      {children}
    </a>
  );
});

const CourseCard = memo(({ title, description, icon: Icon }: CourseCardProps) => (
  <div className="bg-[#111] p-8 rounded-2xl border border-white/5 hover:border-[#FF7A00]/50 transition-all duration-500 group hover:-translate-y-2">
    <div className="mb-6 inline-block p-4 bg-[#FF7A00]/10 rounded-xl group-hover:bg-[#FF7A00]/20 transition-colors">
      <Icon className="w-8 h-8 text-[#FF7A00]" />
    </div>
    <h3 className="text-xl font-bold text-white mb-3 uppercase font-montserrat tracking-tight group-hover:text-[#FF7A00] transition-colors">{title}</h3>
    <p className="text-gray-400 text-sm leading-relaxed">{description}</p>
  </div>
));

const FAQItem = ({ question, answer }: FAQItemProps) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="border-b border-white/5">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full py-7 flex items-center justify-between text-left hover:bg-white/5 px-4 transition-all duration-300 rounded-lg group"
      >
        <span className={`text-lg font-bold pr-8 transition-colors ${isOpen ? 'text-[#FF7A00]' : 'text-white'}`}>{question}</span>
        <div className={`transition-transform duration-500 ${isOpen ? 'rotate-180 text-[#FF7A00]' : 'text-gray-600'}`}>
          <ChevronDown className="w-6 h-6" />
        </div>
      </button>
      <div 
        className={`overflow-hidden transition-all duration-500 ease-in-out ${isOpen ? 'max-h-[500px] opacity-100 pb-8 px-4' : 'max-h-0 opacity-0'}`}
      >
        <p className="text-gray-400 leading-relaxed whitespace-pre-line text-lg font-light">{answer}</p>
      </div>
    </div>
  );
};

// --- Main App ---

export default function App() {
  const CHECKOUT_LINK = "https://curso-de-teologia-comunidade-do-pregador.mycartpanda.com/checkout";

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-black overflow-x-hidden selection:bg-[#FF7A00] selection:text-black font-montserrat">
      
      {/* Scroll Progress Bar */}
      <div className="fixed top-0 left-0 w-full h-1 z-[200]">
        <div className="h-full bg-[#FF7A00] w-0 transition-all duration-150" style={{
          width: '0%', // This would typically be dynamic via window scroll event
        }}></div>
      </div>

      {/* Header */}
      <header className="py-6 px-4 flex justify-center border-b border-white/5 bg-black/80 backdrop-blur-xl sticky top-0 z-[100]">
        <img 
          src="https://i.imgur.com/EF4Nw4G.png" 
          alt="Teologia Acadêmica Essencial Logo" 
          className="h-8 md:h-14 w-auto drop-shadow-[0_0_15px_rgba(255,122,0,0.4)]"
        />
      </header>

      {/* Hero Section */}
      <section className="relative pt-16 md:pt-24 pb-28 md:pb-40 px-4 bg-[radial-gradient(circle_at_top,_#1a1a1a_0%,_#000_70%)] overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute top-1/4 left-0 w-96 h-96 bg-[#FF7A00] opacity-[0.03] blur-[150px] animate-float"></div>
        <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-[#FF7A00] opacity-[0.03] blur-[150px] animate-float" style={{ animationDelay: '2s' }}></div>

        <div className="max-w-7xl mx-auto text-center relative z-10">
          <div className="inline-block px-4 py-1.5 bg-white/5 border border-white/10 rounded-full mb-8 animate-fade-in-up">
            <span className="text-[10px] md:text-sm font-bold uppercase tracking-[0.3em] text-gray-400">Formação Teológica Profissional</span>
          </div>
          
          <h1 className="text-5xl md:text-9xl font-black leading-[0.85] mb-8 uppercase text-white tracking-tighter animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            Teologia Acadêmica <span className="text-[#FF7A00] text-glow">Essencial</span>
          </h1>
          
          <p className="text-xl md:text-3xl font-semibold text-gray-300 mb-10 max-w-4xl mx-auto leading-tight animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
            Entenda a Bíblia com profundidade e clareza — <span className="text-white underline decoration-[#FF7A00] decoration-4 underline-offset-8">mesmo que você esteja começando do zero.</span>
          </p>
          
          <p className="text-lg md:text-xl text-gray-400 mb-14 max-w-3xl mx-auto leading-relaxed font-light animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
            Uma formação interdenominacional completa e acessível, para cristãos que buscam fundamentação sólida e desejam discernir a verdade em meio a interpretações rasas.
          </p>
          
          <div className="flex flex-wrap justify-center gap-4 md:gap-6 mb-16 text-xs md:text-sm font-bold uppercase tracking-widest text-[#FF7A00] animate-fade-in-up" style={{ animationDelay: '0.8s' }}>
            <span className="flex items-center gap-2 bg-white/5 px-6 py-3 rounded-xl border border-white/5 backdrop-blur-sm"><CheckCircle size={18}/> 35 Módulos Completos</span>
            <span className="flex items-center gap-2 bg-white/5 px-6 py-3 rounded-xl border border-white/5 backdrop-blur-sm"><CheckCircle size={18}/> Acesso Vitalício</span>
            <span className="flex items-center gap-2 bg-white/5 px-6 py-3 rounded-xl border border-white/5 backdrop-blur-sm"><CheckCircle size={18}/> Certificado Incluso</span>
          </div>

          <div className="animate-fade-in-up" style={{ animationDelay: '1s' }}>
            <Button href={CHECKOUT_LINK} className="animate-pulse-soft text-xl md:text-3xl py-10 px-14 md:px-24">
              QUERO COMEÇAR MINHA FORMAÇÃO AGORA
            </Button>
            <p className="mt-8 text-gray-500 text-sm uppercase tracking-widest font-bold">Início imediato após a confirmação do pagamento</p>
          </div>
        </div>
      </section>

      {/* Pain Section */}
      <section className="py-24 md:py-40 px-4 bg-[#050505] relative">
        <RevealSection className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h3 className="text-3xl md:text-5xl font-black uppercase text-white tracking-tight mb-6">Sente que falta uma base sólida?</h3>
            <div className="w-24 h-1.5 bg-[#FF7A00] mx-auto rounded-full"></div>
          </div>
          <div className="grid gap-6">
            {[
              "Dificuldade em interpretar textos bíblicos complexos sozinho.",
              "Confusão com tantas linhas teológicas e opiniões diferentes.",
              "Medo de ensinar algo errado ou ser levado por modismos.",
              "Sensação de que o conhecimento é raso e desconectado."
            ].map((text, i) => (
              <div key={i} className="flex items-center gap-6 p-8 bg-white/5 rounded-3xl border border-white/5 hover:border-red-500/20 hover:bg-white/10 transition-all duration-500 group">
                <XCircle className="text-red-500 shrink-0 group-hover:scale-110 transition-transform" size={28}/>
                <p className="text-gray-300 text-lg md:text-2xl font-medium">{text}</p>
              </div>
            ))}
          </div>
          <div className="mt-20 text-center">
            <p className="text-2xl md:text-3xl text-gray-400 italic font-light leading-relaxed">
              "A Teologia Acadêmica Essencial foi desenhada para dar <span className="text-white font-bold text-glow">ordem ao seu conhecimento</span> e segurança à sua fé."
            </p>
          </div>
        </RevealSection>
      </section>

      {/* Benefits Grid */}
      <section className="py-24 md:py-40 px-4 bg-black overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <RevealSection>
            <SectionTitle subtitle="Prepare-se para uma transformação genuína no seu entendimento">O que você vai dominar</SectionTitle>
          </RevealSection>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              "Leitura bíblica com contexto histórico e ferramentas exegéticas.",
              "Fundamentação doutrinária sólida e interdenominacional.",
              "Discernimento real contra heresias e interpretações distorcidas.",
              "Capacidade de ensinar e liderar com autoridade teológica.",
              "Conexão entre teoria teológica e prática cristã diária.",
              "Desenvolvimento de uma cosmovisão bíblica estruturada."
            ].map((item, idx) => (
              <RevealSection key={idx}>
                <div className="flex items-start gap-6 p-10 bg-[#0a0a0a] rounded-[2rem] border border-white/5 hover:bg-[#111] transition-all duration-500 group h-full">
                  <CheckCircle className="w-8 h-8 text-[#FF7A00] shrink-0 group-hover:scale-110 transition-transform" />
                  <span className="text-gray-200 text-lg md:text-xl leading-relaxed font-medium">{item}</span>
                </div>
              </RevealSection>
            ))}
          </div>
        </div>
      </section>

      {/* Modules Section */}
      <section className="py-24 md:py-40 px-4 bg-[#0a0a0a]">
        <div className="max-w-7xl mx-auto">
          <RevealSection>
            <SectionTitle subtitle="O currículo mais completo e organizado do mercado para iniciantes e veteranos">Estrutura da Formação</SectionTitle>
          </RevealSection>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <CourseCard icon={ShieldCheck} title="Base da Fé" description="Introdução à teologia, revelação e autoridade máxima das Escrituras Sagradas." />
            <CourseCard icon={BookOpen} title="Bíblia Profunda" description="Panorama completo do Antigo e Novo Testamento com rigor acadêmico." />
            <CourseCard icon={Zap} title="Hermenêutica" description="Métodos práticos de interpretação, exegese e ferramentas de estudo eficazes." />
            <CourseCard icon={Globe} title="História" description="A jornada da igreja através dos séculos e a evolução das grandes doutrinas." />
            <CourseCard icon={Users} title="Comunicação" description="Didática aplicada, homilética e como transmitir conhecimento com clareza." />
            <CourseCard icon={Plus} title="Eclesiologia" description="A missão da igreja e sua atuação prática e relevante na sociedade contemporânea." />
            <CourseCard icon={UserCheck} title="Liderança" description="Gestão ministerial, aconselhamento bíblico e cuidado integral do rebanho." />
            <CourseCard icon={Star} title="Espiritualidade" description="Conhecimento aliado ao caráter para uma vida cristã madura e equilibrada." />
          </div>
        </div>
      </section>

      {/* Target Section */}
      <section className="py-24 md:py-40 px-4 bg-black overflow-hidden relative">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 md:gap-24 items-center">
          <RevealSection>
            <h2 className="text-4xl md:text-6xl font-black mb-12 uppercase leading-tight">Para quem é esta <span className="text-[#FF7A00]">formação?</span></h2>
            <div className="space-y-8">
              {[
                "Pregadores e Professores de EBD.",
                "Líderes de ministérios e pequenos grupos.",
                "Cristãos que desejam crescer no conhecimento.",
                "Estudantes que buscam uma base acadêmica sólida.",
                "Qualquer pessoa que queira ler a Bíblia sem dúvidas."
              ].map((text, i) => (
                <div key={i} className="flex gap-6 items-center group">
                  <div className="w-3 h-3 rounded-full bg-[#FF7A00] group-hover:scale-150 transition-transform"></div>
                  <p className="text-xl md:text-2xl text-gray-300 font-medium">{text}</p>
                </div>
              ))}
            </div>
            <div className="mt-16">
               <Button href={CHECKOUT_LINK} className="w-full md:w-auto">SIM, EU QUERO ME INSCREVER AGORA</Button>
            </div>
          </RevealSection>
          
          <RevealSection className="relative">
            <div className="absolute -inset-4 bg-gradient-to-r from-[#FF7A00] to-transparent rounded-[3rem] blur-2xl opacity-20"></div>
            <img 
              src="https://pregaicollege.com/wp-content/uploads/2024/05/negro-estudando-biblia-scaled-e1715613576309-1897x2048.jpg" 
              alt="Estudante de teologia" 
              className="rounded-[2.5rem] shadow-[0_0_50px_rgba(0,0,0,1)] grayscale hover:grayscale-0 transition-all duration-1000 w-full object-cover aspect-[4/5] relative z-10 border border-white/10"
            />
          </RevealSection>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="inscricao" className="py-24 md:py-40 px-4 bg-orange-gradient relative overflow-hidden">
        {/* Background Graphic */}
        <div className="absolute -top-20 -right-20 opacity-10 hidden lg:block rotate-12">
           <BookOpen size={600} className="text-white" />
        </div>
        
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <h2 className="text-5xl md:text-9xl font-black mb-6 uppercase tracking-tighter text-black leading-none">Oferta Exclusiva</h2>
          <p className="text-xl md:text-3xl font-bold mb-14 max-w-2xl mx-auto text-black/80 leading-snug uppercase tracking-[0.2em]">
            Acesso completo à formação vitalícia por um valor simbólico
          </p>
          
          <div className="bg-black text-white p-10 md:p-24 rounded-[4rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.6)] transform hover:scale-[1.02] transition-all duration-700 relative">
            <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-red-600 px-6 py-2 rounded-full font-black text-xs md:text-sm tracking-widest animate-bounce">
              OFERTA POR TEMPO LIMITADO
            </div>
            
            <CountdownTimer />

            <p className="text-gray-400 font-bold uppercase tracking-[0.3em] mb-4 text-xs md:text-base">Pagamento Único • Sem Mensalidades</p>
            
            <div className="flex items-baseline justify-center gap-2 mb-12">
              <span className="text-3xl md:text-5xl font-black opacity-50">R$</span>
              <span className="text-8xl md:text-[14rem] font-black leading-none tracking-tighter text-glow">37,00</span>
            </div>
            
            <Button 
              href={CHECKOUT_LINK} 
              className="w-full bg-white text-black hover:bg-gray-100 py-10 md:py-12 text-2xl md:text-4xl font-black shadow-2xl rounded-[2rem]"
            >
              GARANTIR MINHA VAGA AGORA
            </Button>
            
            <div className="mt-14 flex flex-wrap justify-center gap-10 opacity-40">
               <span className="flex items-center gap-3 text-sm font-bold uppercase tracking-widest"><ShieldCheck size={20}/> Compra 100% Segura</span>
               <span className="flex items-center gap-3 text-sm font-bold uppercase tracking-widest"><Zap size={20}/> Acesso Imediato</span>
            </div>
          </div>
        </div>
      </section>

      {/* Guarantee */}
      <section className="py-24 md:py-40 px-4 bg-black">
        <RevealSection className="max-w-4xl mx-auto text-center bg-[#0a0a0a] p-12 md:p-24 rounded-[4rem] border border-white/5 relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#FF7A00] to-transparent opacity-50 group-hover:opacity-100 transition-opacity"></div>
          
          <img 
            src="https://pregaicollege.com/wp-content/uploads/2022/06/garantia-7-dias-300x200-1.png" 
            alt="Garantia 7 Dias" 
            className="mx-auto mb-12 w-48 md:w-56 drop-shadow-[0_0_30px_rgba(255,122,0,0.2)]"
          />
          
          <h2 className="text-4xl md:text-6xl font-black mb-8 uppercase tracking-tight text-white leading-tight">Risco Zero para você</h2>
          
          <p className="text-gray-400 text-xl md:text-2xl leading-relaxed mb-12 font-light">
            Teste a formação por 7 dias. Se por qualquer motivo você achar que não é para você, basta solicitar o reembolso. Devolvemos 100% do seu investimento sem perguntas.
          </p>
          
          <div className="inline-block px-8 py-3 bg-[#FF7A00]/10 border border-[#FF7A00]/30 rounded-full">
            <p className="text-[#FF7A00] font-black uppercase tracking-[0.4em] text-xs md:text-sm">Garantia Incondicional de Satisfação</p>
          </div>
        </RevealSection>
      </section>

      {/* FAQ */}
      <section className="py-24 md:py-40 px-4 bg-[#050505]">
        <div className="max-w-4xl mx-auto">
          <RevealSection>
            <SectionTitle>Dúvidas Frequentes</SectionTitle>
          </RevealSection>
          
          <RevealSection className="bg-[#0a0a0a] rounded-[3rem] p-6 md:p-14 border border-white/5">
            <FAQItem 
              question="Como recebo o acesso ao curso?"
              answer="Imediatamente após a confirmação do pagamento, você receberá em seu e-mail todos os dados de acesso à nossa plataforma exclusiva de alunos. O processo é automatizado e seguro."
            />
            <FAQItem 
              question="O conteúdo é em vídeo ou PDF?"
              answer="A formação é híbrida e otimizada para o aprendizado profundo. Você terá acesso aos módulos densos em PDF (ideal para profundidade acadêmica e referências) e vídeos complementares de aprofundamento, além de materiais extras na área de membros."
            />
            <FAQItem 
              question="Terei suporte para dúvidas?"
              answer="Sim! Temos um canal de suporte dedicado via plataforma para garantir que você não tenha obstáculos em sua jornada de estudos teológicos."
            />
            <FAQItem 
              question="Posso estudar pelo celular?"
              answer="Com certeza. Nossa plataforma utiliza tecnologia moderna e é 100% responsiva. Você pode estudar de onde quiser, seja no smartphone, tablet, laptop ou desktop."
            />
          </RevealSection>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-32 md:py-52 px-4 bg-[radial-gradient(circle_at_bottom,_#3a1a00_0%,_#000_60%)] text-center relative overflow-hidden">
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[150%] h-[300px] bg-[#FF7A00] opacity-5 blur-[120px]"></div>
        
        <RevealSection className="max-w-5xl mx-auto relative z-10">
          <h2 className="text-5xl md:text-8xl font-black mb-12 uppercase tracking-tighter leading-[0.9] text-white">
            A sua jornada teológica <span className="text-[#FF7A00]">começa agora.</span>
          </h2>
          
          <p className="text-2xl md:text-3xl text-gray-400 mb-20 leading-relaxed max-w-4xl mx-auto font-light italic">
            "Não aceite mais a superficialidade. Edifique sua fé sobre a rocha do conhecimento sólido, bíblico e transformador."
          </p>
          
          <Button href={CHECKOUT_LINK} className="text-2xl md:text-5xl py-12 px-16 md:px-28 rounded-[3rem]">
            QUERO MINHA VAGA AGORA
          </Button>
          
          <div className="mt-16 flex justify-center items-center gap-4 text-gray-500 font-bold uppercase tracking-widest text-sm">
            <Clock size={20} className="text-[#FF7A00]" />
            <span>Oferta expira em breve</span>
          </div>
        </RevealSection>
      </section>

      {/* Footer */}
      <footer className="py-24 px-4 bg-black border-t border-white/5 relative z-10">
        <div className="max-w-7xl mx-auto flex flex-col items-center gap-16">
          <img 
            src="https://i.imgur.com/EF4Nw4G.png" 
            alt="Logo" 
            className="h-12 md:h-16 opacity-30 grayscale hover:opacity-100 hover:grayscale-0 transition-all duration-700"
          />
          
          <div className="flex flex-wrap justify-center gap-10 md:gap-16 text-xs md:text-sm font-bold uppercase tracking-[0.3em] text-gray-500 text-center">
            <a href="#" className="hover:text-[#FF7A00] transition-colors">Termos de Uso</a>
            <a href="#" className="hover:text-[#FF7A00] transition-colors">Política de Privacidade</a>
            <a href="#" className="hover:text-[#FF7A00] transition-colors">Suporte ao Aluno</a>
          </div>
          
          <div className="text-center">
            <p className="text-gray-600 text-sm md:text-base font-medium">© {new Date().getFullYear()} Teologia Acadêmica Essencial. Todos os direitos reservados.</p>
            <div className="mt-6 inline-flex items-center gap-4">
              <div className="h-[1px] w-8 bg-gray-800"></div>
              <p className="text-xs text-gray-700 uppercase tracking-[0.5em] font-black italic">SOLI DEO GLORIA</p>
              <div className="h-[1px] w-8 bg-gray-800"></div>
            </div>
          </div>
        </div>
      </footer>

      {/* Floating Action Button */}
      <a 
        href={CHECKOUT_LINK} 
        className="fixed bottom-10 right-10 z-[200] bg-[#FF7A00] text-black p-6 rounded-full shadow-[0_15px_40px_rgba(255,122,0,0.6)] hover:scale-110 hover:-rotate-6 active:scale-90 transition-all animate-bounce-slow flex items-center justify-center group"
        title="Garantir minha vaga agora"
      >
        <Zap size={36} fill="currentColor" className="group-hover:animate-pulse" />
        <span className="absolute right-full mr-4 bg-white text-black text-[10px] font-black px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap tracking-widest uppercase">
          Inscrever-se Agora
        </span>
      </a>

    </div>
  );
}
