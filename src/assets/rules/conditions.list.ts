import { Conditions } from 'src/app/shared/models/conditions/conditions.model';

export const conditions: Conditions[] = [
  {
    name: 'Bleed',
    description: ['A creature that is taking bleed damage takes the listed amount of damage at the beginning of its turn. Bleeding can be stopped by a DC 15 Heal check or through the application of any spell that cures hit point damage (even if the bleed is ability damage). Some bleed effects cause ability damage or even ability drain. Bleed effects do not stack with each other unless they deal different kinds of damage. When two or more bleed effects deal the same kind of damage, take the worse effect. In this case, ability drain is worse than ability damage.'],
    icon: 'bleed',
  },
  {
    name: 'Blinded',
    description: ['The creature cannot see. It takes a –2 penalty to Armor Class, loses its Dexterity bonus to AC (if any), and takes a –4 penalty on most Strength– and Dexterity-based skill checks and on opposed Perception skill checks. All checks and activities that rely on vision (such as reading and Perception checks based on sight) automatically fail. All opponents are considered to have total concealment (50% miss chance) against the blinded character. Blind creatures must make a DC 10 Acrobatics skill check to move faster than half speed. Creatures that fail this check fall prone. Characters who remain blinded for a long time grow accustomed to these drawbacks and can overcome some of them.'],
    icon: 'blinded',
  },
  {
    name: 'Confused',
    description: ['A confused creature is mentally befuddled and cannot act normally. A confused creature cannot tell the difference between ally and foe, treating all creatures as enemies. Allies wishing to cast a beneficial spell that requires a touch on a confused creature must succeed on a melee touch attack. If a confused creature is attacked, it attacks the creature that last attacked it until that creature is dead or out of sight.', 'Roll on the following table at the beginning of each confused subject’s turn each round to see what the subject does in that round.', {header: ['d%', 'Behavior'], rows: [['01-25', 'Act normally.'], ['26–50', 'Do nothing but babble incoherently.'], ['51–75', 'Deal 1d8 points of damage + Str modifier to self with item in hand.'], ['76–100', 'Attack nearest creature (for this purpose, a familiar counts as part of the subject’s self).']]}, 'A confused creature who can’t carry out the indicated action does nothing but babble incoherently. Attackers are not at any special advantage when attacking a confused creature. Any confused creature who is attacked automatically attacks its attackers on its next turn, as long as it is still confused when its turn comes. Note that a confused creature will not make attacks of opportunity against anything that it is not already devoted to attacking (either because of its most recent action or because it has just been attacked).'],
    icon: 'confused',
  },
  {
    name: 'Cowering',
    description: ['The character is frozen in fear and can take no actions. A cowering character takes a –2 penalty to Armor Class and loses his Dexterity bonus (if any).'],
    icon: 'cowering',
  },
  {
    name: 'Dazzled',
    description: ['The creature is unable to see well because of over-stimulation of the eyes. A dazzled creature takes a –1 penalty on attack rolls and sight-based Perception checks.'],
    icon: 'dazzled',
  },
  {
    name: 'Deafened',
    description: ['A deafened character cannot hear. He takes a –4 penalty on initiative checks, automatically fails Perception checks based on sound, takes a –4 penalty on opposed Perception checks, and has a 20% chance of spell failure when casting spells with verbal components. Characters who remain deafened for a long time grow accustomed to these drawbacks and can overcome some of them.'],
    icon: 'deafened',
  },
  {
    name: 'Dying',
    description: ['A dying creature is unconscious and near death. Creatures that have negative hit points and have not stabilized are dying. A dying creature can take no actions. On the character’s next turn, after being reduced to negative hit points (but not dead), and on all subsequent turns, the character must make a DC 10 Constitution check to become stable. The character takes a penalty on this roll equal to his negative hit point total. A character that is stable does not need to make this check. A natural 20 on this check is an automatic success. If the character fails this check, he loses 1 hit point. If a dying creature has an amount of negative hit points equal to its Constitution score, it dies.'],
    icon: 'dying',
  },
  {
    name: 'Energy drained',
    description: ['Some spells and a number of undead creatures have the ability to drain away life and energy; this dreadful attack results in “negative levels.” These cause a character to take a number of penalties.', 'For each negative level a creature has, it takes a cumulative –1 penalty on all ability checks, attack rolls, combat maneuver checks, Combat Maneuver Defense, saving throws, and skill checks. In addition, the creature reduces its current and total hit points by 5 for each negative level it possesses. The creature is also treated as one level lower for the purpose of level-dependent variables (such as spellcasting) for each negative level possessed. Spellcasters do not lose any prepared spells or slots as a result of negative levels. If a creature’s negative levels equal or exceed its total Hit Dice, it dies.', 'A creature with temporary negative levels receives a new saving throw to remove the negative level each day. The DC of this save is the same as the effect that caused the negative levels.', 'Some abilities and spells (such as raise dead) bestow permanent level drain on a creature. These are treated just like temporary negative levels, but they do not allow a new save each day to remove them. Level drain can be removed through spells like restoration. Permanent negative levels remain after a dead creature is restored to life. A creature whose permanent negative levels equal its Hit Dice cannot be brought back to life through spells like raise dead and resurrection without also receiving a restoration spell, cast the round after it is restored to life.'],
    icon: 'energyDrained',
  },
  {
    name: 'Entangled',
    description: ['The character is ensnared. Being entangled impedes movement, but does not entirely prevent it unless the bonds are anchored to an immobile object or tethered by an opposing force. An entangled creature moves at half speed, cannot run or charge, and takes a –2 penalty on all attack rolls and a –4 penalty to Dexterity. An entangled character who attempts to cast a spell must make a concentration check (DC 15 + spell level) or lose the spell.'],
    icon: 'entangled',
  },
  {
    name: 'Exhausted',
    description: ['An exhausted character moves at half speed, cannot run or charge, and takes a –6 penalty to Strength and Dexterity. After 1 hour of complete rest, an exhausted character becomes fatigued. A fatigued character becomes exhausted by doing something else that would normally cause fatigue.'],
    icon: 'exhausted',
  },
  {
    name: 'Fascinated',
    description: ['A fascinated creature is entranced by a supernatural or spell effect. The creature stands or sits quietly, taking no actions other than to pay attention to the fascinating effect, for as long as the effect lasts. It takes a –4 penalty on skill checks made as reactions, such as Perception checks. Any potential threat, such as a hostile creature approaching, allows the fascinated creature a new saving throw against the fascinating effect. Any obvious threat, such as someone drawing a weapon, casting a spell, or aiming a ranged weapon at the fascinated creature, automatically breaks the effect. A fascinated creature’s ally may shake it free of the spell as a standard action.'],
    icon: 'fascinated',
  },
  {
    name: 'Fatigued',
    description: ['A fatigued character can neither run nor charge and takes a –2 penalty to Strength and Dexterity. Doing anything that would normally cause fatigue causes the fatigued character to become exhausted. After 8 hours of complete rest, fatigued characters are no longer fatigued.'],
    icon: 'fatigued',
  },
  {
    name: 'Frightned',
    description: ['A frightened creature flees from the source of its fear as best it can. If unable to flee, it may fight. A frightened creature takes a –2 penalty on all attack rolls, saving throws, skill checks, and ability checks. A frightened creature can use special abilities, including spells, to flee; indeed, the creature must use such means if they are the only way to escape.', 'Frightened is like shaken, except that the creature must flee if possible. Panicked is a more extreme state of fear.'],
    icon: 'frightned',
  },
  {
    name: 'Grappled',
    description: ['A grappled creature is restrained by a creature, trap, or effect. Grappled creatures cannot move and take a –4 penalty to Dexterity. A grappled creature takes a –2 penalty on all attack rolls and combat maneuver checks, except those made to grapple or escape a grapple. In addition, grappled creatures can take no action that requires two hands to perform. A grappled character who attempts to cast a spell or use a spell-like ability must make a concentration check (DC 10 + grappler’s CMB + spell level), or lose the spell. Grappled creatures cannot make attacks of opportunity.', 'A grappled creature cannot use Stealth to hide from the creature grappling it, even if a special ability, such as hide in plain sight, would normally allow it to do so. If a grappled creature becomes invisible, through a spell or other ability, it gains a +2 circumstance bonus on its CMD to avoid being grappled, but receives no other benefit.', 'Casting Spells while Grappled/Grappling: The only spells which can be cast while grappling or pinned are those without somatic components and whose material components (if any) you have in hand. Even so, you must make a concentration check (DC 10 + the grappler’s CMB + the level of the spell you’re casting) or lose the spell.'],
    icon: 'grappled',
  },
  {
    name: 'Helpless',
    description: ['A helpless character is paralyzed, held, bound, sleeping, unconscious, or otherwise completely at an opponent’s mercy. A helpless target is treated as having a Dexterity of 0 (–5 modifier). Melee attacks against a helpless target get a +4 bonus (equivalent to attacking a prone target). Ranged attacks get no special bonus against helpless targets. Rogues can sneak attack helpless targets.', 'As a full-round action, an enemy can use a melee weapon to deliver a coup de grace to a helpless foe. An enemy can also use a bow or crossbow, provided he is adjacent to the target. The attacker automatically hits and scores a critical hit. (A rogue also gets his sneak attack damage bonus against a helpless foe when delivering a coup de grace.) If the defender survives, he must make a Fortitude save (DC 10 + damage dealt) or die. Delivering a coup de grace provokes attacks of opportunity.', 'Creatures that are immune to critical hits do not take critical damage, nor do they need to make Fortitude saves to avoid being killed by a coup de grace.'],
    icon: 'helpless',
  },
  {
    name: 'Invisible',
    description: ['Invisible creatures are visually undetectable. An invisible creature gains a +2 bonus on attack rolls against sighted opponents, and ignores its opponents’ Dexterity bonuses to AC (if any). See the invisibility special ability.'],
    icon: 'invisible',
  },
  {
    name: 'Nauseated',
    description: ['Creatures with the nauseated condition experience stomach distress. Nauseated creatures are unable to attack, cast spells, concentrate on spells, or do anything else requiring attention. The only action such a character can take is a single move action per turn.'],
    icon: 'nauseated',
  },
  {
    name: 'Panicked',
    description: ['A panicked creature must drop anything it holds and flee at top speed from the source of its fear, as well as any other dangers it encounters, along a random path. It can’t take any other actions. In addition, the creature takes a –2 penalty on all saving throws, skill checks, and ability checks. If cornered, a panicked creature cowers and does not attack, typically using the total defense action in combat. A panicked creature can use special abilities, including spells, to flee; indeed, the creature must use such means if they are the only way to escape.', 'Panicked is a more extreme state of fear than shaken or frightened.'],
    icon: 'panicked',
  },
  {
    name: 'Paralyzed',
    description: ['A paralyzed character is frozen in place and unable to move or act. A paralyzed character has effective Dexterity and Strength scores of 0 and is helpless, but can take purely mental actions. A winged creature flying in the air at the time that it becomes paralyzed cannot flap its wings and falls. A paralyzed swimmer can’t swim and may drown. A creature can move through a space occupied by a paralyzed creature—ally or not. Each square occupied by a paralyzed creature, however, counts as 2 squares to move through.'],
    icon: 'paralyzed',
  },
  {
    name: 'Petrified',
    description: ['A petrified character has been turned to stone and is considered unconscious. If a petrified character cracks or breaks, but the broken pieces are joined with the body as he returns to flesh, he is unharmed. If the character’s petrified body is incomplete when it returns to flesh, the body is likewise incomplete and there is some amount of permanent hit point loss and/or debilitation.'],
    icon: 'petrified',
  },
  {
    name: 'Pinned',
    description: ['A pinned creature is tightly bound and can take few actions. A pinned creature cannot move and is denied its Dexterity bonus. A pinned character also takes an additional –4 penalty to his Armor Class. A pinned creature is limited in the actions that it can take. A pinned creature can always attempt to free itself, usually through a combat maneuver check or Escape Artist check. A pinned creature can take verbal and mental actions, but cannot cast any spells that require a somatic or material component. A pinned character who attempts to cast a spell or use a spell-like ability must make a concentration check (DC 10 + grappler’s CMB + spell level) or lose the spell. Pinned is a more severe version of grappled, and their effects do not stack.', 'Casting Spells while Pinned: The only spells which can be cast while grappling or pinned are those without somatic components and whose material components (if any) you have in hand. Even so, you must make a concentration check (DC 10 + the grappler’s CMB + the level of the spell you’re casting) or lose the spell.'],
    icon: 'pinned',
  },
  {
    name: 'Shaken',
    description: ['A shaken character takes a –2 penalty on attack rolls, saving throws, skill checks, and ability checks. Shaken is a less severe state of fear than frightened or panicked.'],
    icon: 'shaken',
  },
  {
    name: 'Sickened',
    description: ['The character takes a –2 penalty on all attack rolls, weapon damage rolls, saving throws, skill checks, and ability checks.'],
    icon: 'sickened',
  },
  {
    name: 'Staggered',
    description: ['A staggered creature may take a single move action or standard action each round (but not both, nor can he take full-round actions). A staggered creature can still take free, swift, and immediate actions. A creature with nonlethal damage exactly equal to its current hit points gains the staggered condition.'],
    icon: 'staggered',
  },
  {
    name: 'Stunned',
    description: ['A stunned creature drops everything held, can’t take actions, takes a –2 penalty to AC, and loses its Dexterity bonus to AC (if any).', 'Attackers receive a +4 bonus on attack rolls to perform combat maneuvers against a stunned opponent.'],
    icon: 'stunned',
  },
  {
    name: 'Unconscious',
    description: ['Unconscious creatures are knocked out and helpless. Unconsciousness can result from having negative hit points (but not more than the creature’s Constitution score), or from nonlethal damage in excess of current hit points.'],
    icon: 'unconscious',
  },
];
